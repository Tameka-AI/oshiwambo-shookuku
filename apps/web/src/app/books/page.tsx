import type { Metadata } from "next";
import Link from "next/link";
import { formatNad, shopOrder, site } from "@shookuku/content";
import { getBooks } from "@/lib/data";
import { PreviewBanner } from "@/components/PreviewBanner";
import { BookCover } from "@/components/BookCover";
import { AddToBasket } from "@/components/AddToBasket";

export const metadata: Metadata = {
  title: "Books",
  description: `The books of ${site.author}, with the core book first. Preview shop.`,
};

export default async function BooksPage() {
  const books = shopOrder(await getBooks());
  const core = books.find((b) => b.featured);
  const rest = books.filter((b) => !b.featured);
  const recent = rest.filter((b) => b.year === 2026);
  const older = rest.filter((b) => b.year !== 2026);

  return (
    <>
      <PreviewBanner />
      <header className="wrap page-head">
        <p className="eyebrow">Bookstore</p>
        <h1>Books by {site.author}</h1>
        <p>
          The record on this site is a set of doorways. The full accounts are in these books. Prices are preview prices
          in Namibian dollars.
        </p>
      </header>

      {core ? (
        <section className="wrap featured-book" aria-labelledby="core-title">
          <Link href={`/books/${core.id}`} className="shop-cover shop-cover--lead">
            <BookCover book={core} author={site.author} eager />
          </Link>
          <div>
            <p className="eyebrow">The core book · {core.language}</p>
            <h2 id="core-title">
              <Link href={`/books/${core.id}`} className="plain">{core.title}</Link>
            </h2>
            {core.subtitle ? <p className="osh">{core.subtitle}</p> : null}
            <p>{core.blurb}</p>
            <p className="meta-line">
              {core.publisher}, {core.details?.place ?? ""} {core.year}
              {core.details ? <> · ISBN {core.details.isbn}</> : null}
            </p>
            <p className="price">
              {formatNad(core.priceNad)} <span>preview price</span>
            </p>
            <AddToBasket id={core.id} title={core.title} />
            <p style={{ marginTop: "1.25rem" }}>
              <Link href={`/books/${core.id}`}>Cover, back, and a look inside →</Link>
            </p>
          </div>
        </section>
      ) : null}

      {recent.length ? (
        <section className="section">
          <div className="wrap">
            <div className="section__head">
              <h2>New in 2026</h2>
              <span className="count" style={{ margin: 0 }}>{recent.length} titles · Microwide Publishing</span>
            </div>
            <ul className="shop-grid">
              {recent.map((b) => (
                <li key={b.id} id={b.id}>
                  <Link href={`/books/${b.id}`} className="shop-cover">
                    <BookCover book={b} author={site.author} />
                  </Link>
                  <h3><Link href={`/books/${b.id}`} className="plain">{b.title}</Link></h3>
                  {b.subtitle ? <p className="sub">{b.subtitle}</p> : null}
                  <p className="price">{formatNad(b.priceNad)} <span>preview price</span></p>
                  <AddToBasket id={b.id} title={b.title} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Bibliography</h2>
            <span className="count" style={{ margin: 0 }}>{books.length} titles in all</span>
          </div>
          <ul className="shelf">
            {older.map((b) => (
              <li key={b.id} id={b.id}>
                <span className="year">{b.year}</span>
                <div>
                  <h3><Link href={`/books/${b.id}`} className="plain">{b.title}</Link></h3>
                  {b.subtitle ? <p className="sub">{b.subtitle}</p> : null}
                  <p className="blurb">{b.blurb}</p>
                  <p className="price">{formatNad(b.priceNad)} <span>preview price</span></p>
                  <AddToBasket id={b.id} title={b.title} />
                </div>
                <span className="pub">
                  {b.publisher}
                  <br />
                  {b.language} · {b.category}
                </span>
              </li>
            ))}
          </ul>
          <p className="fine-print" style={{ marginTop: "1.5rem" }}>
            More titles from the author’s list are being added.
          </p>
        </div>
      </section>
    </>
  );
}
