# ADR-0001: One monorepo, one database

**Status:** accepted · 26 September 2026

## Context

The record covers lifecycle rituals, the homestead, marriage, kinship, ethnobotany, greetings, and a bookstore. Separate repos per surface would duplicate the content model and split the database.

## Decision

One repository, `Tameka-AI/oshiwambo-shookuku`, with `apps/*` for deployable surfaces and `packages/*` for shared code and content. One Supabase project. Subdomains such as `books.oshiwamboshookuku.com` can later be served from the same repo.

## Consequences

- The content package is the single seed for both the static site and the Supabase seed.
- New surfaces are new folders under `apps/`, not new repos.
