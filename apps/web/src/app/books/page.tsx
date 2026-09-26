import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@shookuku/content";
import { getBooks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Books",
  description: `The bibliography of ${site.author}, with the core book first.`,
};

function Availability({ url }: { url?: string }) {
  return url ? (
    <a className="avail" href={url} rel="noopener">Where to buy</a>
  ) : (
    <span className="avail">Ordering details to come</span>
  );
}

export default async function BooksPage() {
  const books = await getBooks();
  const core = books.find((b) => b.featured);
  const rest = books.filter((b) => !b.featured).sort((a, b) => b.year - a.year);

  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">Bookstore</p>
        <h1>Books by {site.author}</h1>
        <p>
          The record on this site is a set of doorways. The full accounts are here. Online ordering is not yet set up;
          each title will link to its publisher or a seller once one is confirmed.
        </p>
      </header>

      {core ? (
        <section className="wrap featured-book" id={core.id} aria-labelledby="core-title">
          <div className="cover" aria-hidden="true">
            <small>{core.publisher}, {core.year}</small>
            <div>
              <b>{core.title}</b>
              <br />
              <i>{core.subtitle}</i>
            </div>
            <small>{site.author}</small>
          </div>
          <div>
            <p className="eyebrow">The core book · {core.language}</p>
            <h2 id="core-title">{core.title}</h2>
            {core.subtitle ? <p className="osh">{core.subtitle}</p> : null}
            <p>{core.blurb}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--ink-mute)" }}>
              {core.publisher}, {core.year}
            </p>
            <Availability url={core.buyUrl} />
            <p style={{ marginTop: "1.5rem" }}>
              <Link href="/explore">Explore the doorways drawn from this book</Link>
            </p>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Bibliography</h2>
            <span className="count" style={{ margin: 0 }}>{rest.length + (core ? 1 : 0)} titles</span>
          </div>
          <ul className="shelf">
            {rest.map((b) => (
              <li key={b.id} id={b.id}>
                <span className="year">{b.year}</span>
                <div>
                  <h3>{b.title}</h3>
                  {b.subtitle ? <p className="sub">{b.subtitle}</p> : null}
                  <p className="blurb">{b.blurb}</p>
                  <Availability url={b.buyUrl} />
                </div>
                <span className="pub">
                  {b.publisher}
                  <br />
                  {b.language} · {b.category}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
