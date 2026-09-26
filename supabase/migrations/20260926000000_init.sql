-- Oshiwambo Shookuku — initial schema
-- Follows docs/10-implementation-brief-for-claude.md §3, with four additive columns:
--   collections.source_count / source_unit / tone, entries.status_basis / sources / tone.
-- Public (anon) may read published rows only. No anon or authenticated writes in phase 1.

create table public.collections (
  slug          text primary key,
  title         text not null,
  title_osh     text,
  summary       text not null,
  source_file   text,
  source_count  int,
  source_unit   text,
  cover_path    text,
  tone          text,
  sort_order    int not null default 0
);

create table public.entries (
  id               text primary key,
  collection_slug  text not null references public.collections(slug) on update cascade,
  title            text not null,
  title_osh        text,
  status           text not null default 'unspecified'
                   check (status in ('living','fading','historical','unspecified')),
  status_basis     text,
  summary          text not null,
  who              text,
  when_text        text,
  where_text       text,
  why              text,
  body_md          text,
  sources          text[] not null default '{}',
  image_path       text,
  tone             text,
  sort_order       int not null default 0,
  published        boolean not null default false,
  -- A stated status must carry the source sentence that supports it.
  constraint status_needs_basis check (status = 'unspecified' or status_basis is not null)
);

create index entries_collection_idx on public.entries (collection_slug, sort_order);

create table public.books (
  id         text primary key,
  title      text not null,
  subtitle   text,
  year       int,
  publisher  text,
  language   text,
  category   text,
  blurb      text,
  featured   boolean not null default false,
  buy_url    text,
  sort_order int not null default 0
);

create table public.media_assets (
  id            uuid primary key default gen_random_uuid(),
  entry_id      text references public.entries(id) on delete cascade,
  kind          text not null check (kind in ('image','audio','video')),
  storage_path  text not null,
  caption       text,
  language      text
);

-- ── Row Level Security ──────────────────────────────────────────────────
alter table public.collections  enable row level security;
alter table public.entries      enable row level security;
alter table public.books        enable row level security;
alter table public.media_assets enable row level security;

-- Collections and books have no draft state: the whole table is public catalogue.
create policy "public read collections" on public.collections
  for select to anon, authenticated using (true);

create policy "public read books" on public.books
  for select to anon, authenticated using (true);

create policy "public read published entries" on public.entries
  for select to anon, authenticated using (published = true);

create policy "public read media of published entries" on public.media_assets
  for select to anon, authenticated
  using (exists (select 1 from public.entries e where e.id = entry_id and e.published));

-- No insert/update/delete policies exist, so RLS denies every write from anon and
-- authenticated. The service role bypasses RLS and is used only server-side.
revoke insert, update, delete, truncate on
  public.collections, public.entries, public.books, public.media_assets
  from anon, authenticated;

-- ── Storage ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of the media bucket. Uploads only via service role until an admin route exists.
create policy "public read media bucket" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
