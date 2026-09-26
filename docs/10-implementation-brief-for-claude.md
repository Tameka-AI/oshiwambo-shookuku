# Implementation brief — Oshiwambo Shookuku

**For:** Claude (or any coding agent) picking up after this preview  
**Date:** 26 September 2026  
**Author of the knowledge:** Professor Petrus Angula Mbenzi  
**Technical lead:** Heinrich Naatwilwe Aluvilu  
**Organisation:** [Tameka-AI on GitHub](https://github.com/orgs/Tameka-AI/repositories)  
**Name:** Oshiwambo Shookuku  
**Reserved domain:** oshiwamboshookuku.com  
**Preview goal:** demonstrate the record, the bookstore, and the content model — not ship the full books.

This brief replaces the July name “Omuthigululwakalo” as the **platform** name. The book title *Omuthigululwakalo gwAawambo ohela nonena* stays the title of the core book. “Shookuku” is the ancestors; the old radio phrase *Moshinkoti shookuku* (“in the footsteps of our ancestors”) is the line under the wordmark.

---

## 1. What changed on 26 September 2026

Professor Mbenzi supplied seven Word files. They are converted to Markdown in [docs/source](source/INDEX.md).

The product is no longer “one lifecycle book website.” It is a cultural record with six collections:

1. Lifecycle / rituals and ceremonies  
2. Traditional homestead (14 places)  
3. Marriage rules (before, during, after)  
4. Kinship, address, and clan  
5. Ethnobotany (start with omugolo, omusati, ekaka/omboga)  
6. Forms of greeting (13 situations)

Plus the bookstore (16 titles from his bibliography) and a short author page.

The live preview in this workspace is an editorial site in the manner of Google Arts & Culture: full-bleed photography, large serif headlines, horizontal story row, collection tiles, search. Palette is paper, ink, clay, sand, moss — Namibian earth, not a generic purple gradient. Photographs in the preview are atmospheric studies (homestead, mopane, hearth, basket, marula, kraal), not field documentation. Replace them with the professor’s own images when he provides them.

---

## 2. Repository

Create **one** repository under Tameka-AI:

`https://github.com/Tameka-AI/oshiwambo-shookuku`

Do not split lifecycle, bookstore, and homestead into separate repos. ADR-0001 still holds: one monorepo, several deployable surfaces later, one database. Subdomains (`books.oshiwamboshookuku.com`) can be added from the same repo when needed. They are not required for the first Vercel demo.

Suggested layout:

```text
apps/web          Next.js (App Router) + TypeScript — public site
packages/content  Markdown + JSON catalog (generated from docs/source)
supabase/         migrations, seed, storage policies
docs/             this brief, ADRs, source markdown
```

The July plan named a Go API. Keep that as phase 2. Phase 1 (demo on Vercel) should be Next.js reading Supabase directly with the anon key and Row Level Security. Add Go only when there is an admin write-path or media pipeline that should not live in the browser.

---

## 3. Supabase

Create a project named `oshiwambo-shookuku` in the region closest to southern Africa (EU if southern Africa is unavailable).

### Tables

```sql
create table collections (
  slug text primary key,
  title text not null,
  title_osh text,
  summary text not null,
  source_file text,
  cover_path text,
  sort_order int not null default 0
);

create table entries (
  id text primary key,
  collection_slug text not null references collections(slug),
  title text not null,
  title_osh text,
  status text not null check (status in ('living','fading','historical','unspecified')),
  summary text not null,
  who text,
  when_text text,
  where_text text,
  why text,
  body_md text,
  image_path text,
  sort_order int not null default 0,
  published boolean not null default false
);

create table books (
  id text primary key,
  title text not null,
  subtitle text,
  year int,
  publisher text,
  language text,
  category text,
  blurb text,
  featured boolean not null default false,
  buy_url text
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  entry_id text references entries(id),
  kind text not null check (kind in ('image','audio','video')),
  storage_path text not null,
  caption text,
  language text
);
```

### Rules

- Public read of rows where `published = true` via RLS. No anon writes.
- `body_md` holds the professor’s text only after he marks a section publishable. Until then, seed `summary` only and leave `published` true for the teasers already in the preview.
- Storage bucket `media`, public read for published objects, authenticated write later.
- Do not put service-role keys in the frontend or in git.

Seed from `src/data/catalog.ts` in this preview plus the Markdown headings in `docs/source`. Do not paste entire unpublished chapters into the public site.

---

## 4. Vercel

- Import `Tameka-AI/oshiwambo-shookuku`.
- Framework: Next.js.
- Environment (Vercel, not committed):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` — server only, unused until an admin route exists
- Production domain later: `oshiwamboshookuku.com` and `www`.
- Until DNS is ready, the `*.vercel.app` URL is the demonstration link for the professor.
- First demo can ship with the static catalog even before Supabase is wired, then switch reads to Supabase without changing the pages.

---

## 5. Pages to implement (match this preview)

| Route | Purpose |
|---|---|
| `/` | Hero, story row, six collections, fourteen dialects |
| `/explore` | Search plus collection and status filters |
| `/stories/[id]` | One doorway: who, when, where, why, teaser |
| `/collections/[slug]` | Collection intro and its entries |
| `/books` | Bibliography, core title featured |
| `/about` | Professor, name, domain, publishing rule |

Design constraints for whoever codes the production app:

- Serif for titles (Newsreader or similar), sans for UI (Outfit or similar).
- Background paper `#f4efe6`, ink `#1a1612`, one accent clay `#9c3d24`.
- Large photography, tight type, almost no chrome. Look at artsandculture.google.com: horizontal stories, full-bleed chapters, quiet navigation.
- No emoji icons. No purple gradients. No invented ritual steps.
- Mobile first. Search must work without an account.

---

## 6. Content rules

- Attribute every public paragraph to the professor’s file named in the collection.
- Status `living` / `fading` / `historical` only when the source supports it. Otherwise `unspecified`.
- Dialect differences (especially Oshikwanyama, Oshimbadja, Oshimbalantu kinship terms) are first-class, not footnotes.
- Audio later: pronunciation of greetings and plant names. Schema already has `media_assets.kind = audio`.
- The bookstore never pretends checkout works until a real payment or “contact the publisher” link exists.

---

## 7. Order of work for the next agent

1. Create the GitHub repo under Tameka-AI and push this brief, `docs/source`, and the catalog.
2. Reserve `oshiwamboshookuku.com` (Namecheap, Cloudflare, or NA registrar). Point it only after the Vercel project exists.
3. Create the Supabase project and run the migration above. Seed teasers. Confirm RLS with the anon key (read published, write denied).
4. Build the six pages in Next.js to match this preview.
5. Deploy to Vercel and send the professor the `*.vercel.app` link.
6. Only then transcribe publishable sections from `docs/source` into `entries.body_md`, one collection at a time, starting with homestead (shortest, most concrete) and greetings.

---

## 8. Explicitly out of scope for the first deploy

- User accounts
- Comments
- Full-text of the books
- Payments
- A separate Go service
- Subdomains per book
