"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterEntries, normalise, STATUS_LABEL, STATUSES, type Book, type Entry, type Status } from "@shookuku/content";

type Props = { entries: Entry[]; collections: { slug: string; title: string }[]; books: Book[] };

export function ExploreClient({ entries, collections, books }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const collection = params.get("collection") ?? "";
  const statusParam = params.get("status") ?? "";
  const status = (STATUSES as readonly string[]).includes(statusParam) ? (statusParam as Status) : undefined;

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  const results = useMemo(
    () => filterEntries(entries, { q, collection: collection || undefined, status }),
    [entries, q, collection, status],
  );

  const bookHits = useMemo(() => {
    const n = normalise(q.trim());
    if (!n) return [];
    return books.filter((b) => normalise([b.title, b.subtitle, b.blurb, b.category].join(" ")).includes(n));
  }, [books, q]);

  const titleOf = new Map(collections.map((c) => [c.slug, c.title]));
  const present = new Set(entries.map((e) => e.status));

  return (
    <>
      <div className="filters">
        <form role="search" className="search search--ink" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="explore-q" className="sr-only">Search</label>
          <input
            id="explore-q"
            type="search"
            placeholder="Search titles, Oshiwambo terms, places, people…"
            defaultValue={q}
            onChange={(e) => set("q", e.target.value)}
            autoComplete="off"
          />
        </form>
        <div className="chips" role="group" aria-label="Collection">
          <span className="label">Collection</span>
          <button type="button" className="chip" aria-pressed={!collection} onClick={() => set("collection", "")}>All</button>
          {collections.map((c) => (
            <button key={c.slug} type="button" className="chip" aria-pressed={collection === c.slug} onClick={() => set("collection", collection === c.slug ? "" : c.slug)}>
              {c.title}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Status">
          <span className="label">Status</span>
          <button type="button" className="chip" aria-pressed={!status} onClick={() => set("status", "")}>Any</button>
          {STATUSES.filter((s) => present.has(s)).map((s) => (
            <button key={s} type="button" className="chip" aria-pressed={status === s} onClick={() => set("status", status === s ? "" : s)}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <p className="count" aria-live="polite">
        {results.length} {results.length === 1 ? "entry" : "entries"}
        {q ? <> for “{q}”</> : null}
      </p>

      {results.length ? (
        <ul className="mini" style={{ marginBottom: "2rem" }}>
          {results.map((e) => (
            <li key={e.id}>
              <Link href={`/stories/${e.id}`} style={{ flexWrap: "wrap" }}>
                <span>
                  {e.title}
                  {e.osh ? <em className="osh" style={{ fontSize: "0.95rem", marginLeft: "0.6rem" }}>{e.osh}</em> : null}
                </span>
                <span>
                  {titleOf.get(e.collection)} · {STATUS_LABEL[e.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Nothing in the record matches yet. Try an Oshiwambo term, or clear a filter.</p>
      )}

      {bookHits.length ? (
        <section className="book-hits" aria-label="Matching books">
          <p className="eyebrow">In the author’s books</p>
          <ul className="mini">
            {bookHits.map((b) => (
              <li key={b.id}>
                <Link href={`/books/${b.id}`}>
                  <span>{b.title}</span>
                  <span>{b.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
