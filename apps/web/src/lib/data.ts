import "server-only";
import { cache } from "react";
import * as catalog from "@shookuku/content";
import type { Book, Collection, Entry, SourceKey, Status, Tone } from "@shookuku/content";
import { supabase } from "./supabase";

/**
 * One read interface for every page.
 * - No Supabase env → static catalog from packages/content.
 * - Supabase env set → published rows via the anon key (RLS enforced).
 * Pages never know which one they got.
 */

export const dataSource = supabase ? "supabase" : "catalog";

const fileToKey = new Map(Object.entries(catalog.sources).map(([k, s]) => [s.file, k as SourceKey]));

type CollectionRow = {
  slug: string; title: string; title_osh: string | null; summary: string; source_file: string | null;
  source_count: number | null; source_unit: string | null; cover_path: string | null; tone: string | null;
};
type EntryRow = {
  id: string; collection_slug: string; title: string; title_osh: string | null; status: Status;
  status_basis: string | null; summary: string; who: string | null; when_text: string | null;
  where_text: string | null; why: string | null; body_md: string | null; sources: string[] | null;
  image_path: string | null; tone: string | null;
};
type BookRow = {
  id: string; title: string; subtitle: string | null; year: number | null; publisher: string | null;
  language: string | null; category: string | null; blurb: string | null; featured: boolean; buy_url: string | null;
};

const u = <T,>(v: T | null) => (v === null ? undefined : v);

function toCollection(r: CollectionRow): Collection {
  return {
    slug: r.slug,
    title: r.title,
    osh: u(r.title_osh),
    blurb: r.summary,
    source: (r.source_file && fileToKey.get(r.source_file)) || "description",
    sourceCount: r.source_count && r.source_unit ? { n: r.source_count, unit: r.source_unit } : undefined,
    image: u(r.cover_path),
    tone: (r.tone as Tone) ?? "sand",
  };
}

function toEntry(r: EntryRow): Entry {
  return {
    id: r.id,
    collection: r.collection_slug,
    title: r.title,
    osh: u(r.title_osh),
    status: r.status,
    statusBasis: u(r.status_basis),
    summary: r.summary,
    who: r.who ?? "",
    when: r.when_text ?? "",
    where: r.where_text ?? "",
    why: r.why ?? "",
    bodyMd: u(r.body_md),
    sources: (r.sources ?? []) as SourceKey[],
    image: u(r.image_path),
    tone: (r.tone as Tone) ?? "sand",
  };
}

function toBook(r: BookRow): Book {
  return {
    id: r.id,
    title: r.title,
    subtitle: u(r.subtitle),
    year: r.year ?? 0,
    publisher: r.publisher ?? "",
    language: r.language ?? "",
    category: r.category ?? "",
    blurb: r.blurb ?? "",
    featured: r.featured,
    buyUrl: u(r.buy_url),
  };
}

export const getCollections = cache(async (): Promise<Collection[]> => {
  if (!supabase) return catalog.collections;
  const { data, error } = await supabase.from("collections").select("*").order("sort_order");
  if (error) throw error;
  return (data as CollectionRow[]).map(toCollection);
});

export const getEntries = cache(async (): Promise<Entry[]> => {
  if (!supabase) return catalog.entries;
  const { data, error } = await supabase.from("entries").select("*").order("sort_order");
  if (error) throw error;
  return (data as EntryRow[]).map(toEntry);
});

export const getBooks = cache(async (): Promise<Book[]> => {
  if (!supabase) return catalog.books;
  const { data, error } = await supabase.from("books").select("*").order("sort_order");
  if (error) throw error;
  return (data as BookRow[]).map(toBook);
});

export async function getCollection(slug: string) {
  return (await getCollections()).find((c) => c.slug === slug);
}

export async function getEntry(id: string) {
  return (await getEntries()).find((e) => e.id === id);
}

export async function getEntriesFor(slug: string) {
  return (await getEntries()).filter((e) => e.collection === slug);
}
