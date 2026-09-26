export * from "./types";
export * from "./catalog";

import { books, collections, entries, sources } from "./catalog";
import type { Entry, Status } from "./types";

export function collectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function entriesFor(slug: string) {
  return entries.filter((e) => e.collection === slug);
}

export function entryById(id: string) {
  return entries.find((e) => e.id === id);
}

export function sourceTitle(key: Entry["sources"][number]) {
  return sources[key].title;
}

/** Lowercase and strip diacritics so “oshipe” matches “Oshipe” and apostrophes do not matter. */
export function normalise(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'‘]/g, "")
    .toLowerCase();
}

export type SearchFilters = { q?: string; collection?: string; status?: Status };

export function filterEntries(list: Entry[], f: SearchFilters) {
  const n = normalise((f.q ?? "").trim());
  return list.filter((e) => {
    if (f.collection && e.collection !== f.collection) return false;
    if (f.status && e.status !== f.status) return false;
    if (!n) return true;
    const hay = normalise([e.title, e.osh, e.summary, e.who, e.when, e.where, e.why].filter(Boolean).join(" "));
    return n.split(/\s+/).every((w) => hay.includes(w));
  });
}

export function searchBooks(q: string) {
  const n = normalise(q.trim());
  if (!n) return books;
  return books.filter((b) =>
    normalise([b.title, b.subtitle, b.blurb, b.category, b.language].filter(Boolean).join(" ")).includes(n),
  );
}

/** Shop order: the core book, then the 2026 titles, then the rest newest first. */
export function shopOrder<T extends { featured: boolean; year: number; title: string }>(list: T[]) {
  const rank = (b: T) => (b.featured ? 0 : b.year === 2026 ? 1 : 2);
  return [...list].sort((a, b) => rank(a) - rank(b) || b.year - a.year || a.title.localeCompare(b.title));
}

export function formatNad(n: number) {
  // Deterministic (no locale APIs) so server and client render the same string.
  return `N$${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
