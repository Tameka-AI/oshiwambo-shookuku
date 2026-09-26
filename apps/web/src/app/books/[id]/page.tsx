import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNad, site } from "@shookuku/content";
import { getBook, getBooks, getEntriesFor } from "@/lib/data";
import { PreviewBanner } from "@/components/PreviewBanner";
import { BookCover } from "@/components/BookCover";
import { BookViewer } from "@/components/BookViewer";
import { AddToBasket } from "@/components/AddToBasket";
import { HomesteadMap } from "@/components/HomesteadMap";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getBooks()).map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const b = await getBook((await params).id);
  if (!b) return {};
  return {
    title: b.title,
    description: b.subtitle ? `${b.subtitle}. ${b.blurb}` : b.blurb,
    openGraph: b.details ? { images: [{ url: b.details.front.src }] } : undefined,
  };
}

export default async function BookPage({ params }: Params) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();
  const d = book.details;
  const homestead = d?.homesteadMap ? await getEntriesFor("homestead") : [];

  return (
    <>
      <PreviewBanner />
      <article className="wrap book">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/books">Books</Link>
          <span aria-hidden="true">/</span>
          <span>{book.year}</span>
        </nav>

        <div className="book__grid">
          <div className="book__visual">
            {d ? <BookViewer d={d} /> : <div className="shop-cover shop-cover--lead"><BookCover book={book} author={site.author} eager /></div>}
          </div>

          <div className="book__text">
            {book.featured ? <p className="eyebrow">The core book · {book.language}</p> : <p className="eyebrow">{book.category} · {book.language}</p>}
            <h1>{book.title}</h1>
            {book.subtitle ? <p className="osh osh-title">{book.subtitle}</p> : null}
            <p className="book__by">{d?.author ?? site.author}</p>
            <p className="lede">{book.blurb}</p>

            <p className="price price--big">
              {formatNad(book.priceNad)} <span>preview price</span>
            </p>
            <AddToBasket id={book.id} title={book.title} />

            <dl className="facts" style={{ marginTop: "2rem" }}>
              <div><dt>Year</dt><dd>{book.year}</dd></div>
              <div><dt>Publisher</dt><dd>{book.publisher}{d ? `, ${d.place}` : ""}</dd></div>
              {d ? <div><dt>Printed by</dt><dd>{d.printer}</dd></div> : null}
              {d ? <div><dt>ISBN</dt><dd>{d.isbn}</dd></div> : null}
              {d ? <div><dt>Illustrators</dt><dd>{d.illustrators}</dd></div> : null}
              <div><dt>Language</dt><dd>{book.language}</dd></div>
            </dl>

            {d ? (
              <details className="colophon">
                <summary>The colophon page</summary>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.colophon.src} width={d.colophon.width} height={d.colophon.height} alt={d.colophon.alt} loading="lazy" />
              </details>
            ) : null}

            {book.featured ? (
              <p className="notice">
                The doorways on this site summarise the author’s working papers. The full account is in this book.{" "}
                <Link href="/explore">Explore the doorways</Link>.
              </p>
            ) : null}
          </div>
        </div>
      </article>

      {d?.homesteadMap ? (
        <section className="section" aria-labelledby="hmap-title">
          <div className="wrap">
            <div className="section__head">
              <h2 id="hmap-title">The homestead on the cover</h2>
              <Link href="/collections/homestead">The homestead collection</Link>
            </div>
            <HomesteadMap map={d.homesteadMap} stories={homestead} />
          </div>
        </section>
      ) : null}
    </>
  );
}
