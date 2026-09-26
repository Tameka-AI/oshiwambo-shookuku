-- Run after migration + seed:  psql "$DATABASE_URL" -f supabase/tests/rls_check.sql
-- Impersonates the anon role and asserts: published rows readable, drafts hidden, writes denied.
begin;

-- A draft row the public must never see (rolled back at the end).
insert into public.entries (id, collection_slug, title, summary, published)
values ('__rls_draft__', 'homestead', 'Draft', 'Not for the public', false);

set local role anon;

do $$
declare n int;
begin
  select count(*) into n from public.entries;
  if n = 0 then raise exception 'FAIL: anon sees no published entries'; end if;

  select count(*) into n from public.entries where published = false;
  if n <> 0 then raise exception 'FAIL: anon can see % unpublished entries', n; end if;

  select count(*) into n from public.entries where id = '__rls_draft__';
  if n <> 0 then raise exception 'FAIL: anon can see the draft row'; end if;

  begin
    insert into public.entries (id, collection_slug, title, summary, published)
    values ('__rls_write__', 'homestead', 'x', 'x', true);
    raise exception 'FAIL: anon insert into entries succeeded';
  exception when insufficient_privilege then null;
  end;

  begin
    update public.books set blurb = 'x' where id = 'core';
    raise exception 'FAIL: anon update on books succeeded';
  exception when insufficient_privilege then null;
  end;

  begin
    delete from public.collections where slug = 'homestead';
    raise exception 'FAIL: anon delete on collections succeeded';
  exception when insufficient_privilege then null;
  end;

  raise notice 'PASS: anon reads published rows only; inserts, updates and deletes are denied.';
end $$;

rollback;
