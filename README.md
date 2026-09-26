# Oshiwambo Shookuku

Public cultural record of Oshiwambo life, drawn from the work of **Professor Petrus Angula Mbenzi**.

The line under the name is *Moshinkoti shookuku* — in the footsteps of our ancestors.

| | |
|---|---|
| Domain to reserve | [oshiwamboshookuku.com](https://oshiwamboshookuku.com) |
| GitHub organisation | [Tameka-AI](https://github.com/orgs/Tameka-AI/repositories) |
| Repository | `Tameka-AI/oshiwambo-shookuku` |
| Demonstration host | Vercel (`*.vercel.app` until the domain is attached) |
| Database | Supabase (published rows only) |

The name **Omuthigululwakalo** remains the title of the core book (*Omuthigululwakalo gwAawambo ohela nonena*). It is not the name of the platform.

## Layout

```text
apps/web            Next.js (App Router) + TypeScript — the public site
packages/content    Seed catalog: collections, entries, books, dialects
supabase/           Migration, generated seed, RLS check
scripts/            generate-seed.ts (catalog → supabase/seed.sql)
docs/               Implementation brief, ADRs, content audit, author source papers
```

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build
```

With no Supabase variables set, the site reads the static catalog in `packages/content`. To read from Supabase, copy `.env.example` to `apps/web/.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The pages do not change.

## Supabase

```bash
supabase link --project-ref <ref>
supabase db push                     # runs supabase/migrations
pnpm seed:generate                   # regenerates supabase/seed.sql from the catalog
psql "$DATABASE_URL" -f supabase/seed.sql
psql "$DATABASE_URL" -f supabase/tests/rls_check.sql
```

Anonymous users can read published rows and nothing else. The service-role key never goes into the frontend or git.

## Vercel

Import the repo, set **Root Directory** to `apps/web`, framework Next.js. Add the three variables from `.env.example` in the Vercel dashboard.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero, story row, six collections, fourteen dialects |
| `/explore` | Search plus collection and status filters |
| `/stories/[id]` | One doorway: who, when, where, why, teaser |
| `/collections/[slug]` | Collection intro and its entries |
| `/books` | Bibliography, core title featured |
| `/about` | Professor, name, domain, publishing rule |

## Content rules

- The site shows short, attributed doorways. Full procedures stay in the author files until Professor Mbenzi releases them.
- Every entry names the source paper it comes from.
- A status (`living`, `fading`, `historical`) appears only when a sentence in the source supports it; that sentence is stored in `statusBasis`. Everything else is `unspecified`.
- See [docs/content-audit-2026-09-26.md](docs/content-audit-2026-09-26.md) for what was corrected and what awaits the professor.

## Author files

[docs/source/INDEX.md](docs/source/INDEX.md) — working papers, not for verbatim republication.
