# ADR-0002: Phase 1 is Next.js reading Supabase directly; the Go API is deferred

**Status:** accepted · 26 September 2026

## Context

The July plan named a Go API. The first deploy is read-only: published teasers, a bibliography, an about page. No accounts, comments, payments, or admin writes.

## Decision

Phase 1 is Next.js (App Router) on Vercel. Server components read Supabase with the anon key; Row Level Security exposes only `published = true` rows and denies all anonymous writes. When Supabase variables are absent the same data functions return the static catalog, so the demo can ship before the database exists.

## When to revisit

Add a Go service when there is an admin write path (the professor releasing sections into `body_md`) or a media pipeline (audio for greetings and plant names) that should not run in the browser.
