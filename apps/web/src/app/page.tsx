import Link from "next/link";
import { dialects, people, site } from "@shookuku/content";
import { getBooks, getCollections, getEntries } from "@/lib/data";
import { Plate } from "@/components/Plate";
import { StoryCard } from "@/components/StoryCard";
import { CollectionTile } from "@/components/CollectionTile";
import { Attribution } from "@/components/Attribution";

/** Doorways shown in the home story row, in this order. */
const FEATURED = ["omugolo", "eelo", "cattle", "naming", "oshoto", "exogamy", "visitor", "omitima", "new-house"];

export default async function Home() {
  const [collections, entries, books] = await Promise.all([getCollections(), getEntries(), getBooks()]);
  const byId = new Map(entries.map((e) => [e.id, e]));
  const story = FEATURED.map((id) => byId.get(id)).filter((e) => e !== undefined);
  const titleOf = new Map(collections.map((c) => [c.slug, c.title]));
  const core = books.find((b) => b.featured);

  return (
    <>
      <Plate tone="dusk" alt="" word="Shookuku" className="hero" priority>
        <div className="wrap hero__inner">
          <p className="eyebrow">A record of Oshiwambo life</p>
          <h1>{site.name}</h1>
          <p className="line">
            {site.line}
            <span>{site.lineEn}</span>
          </p>
          <p className="lede">
            The homestead, the ceremonies of a life, the rules of marriage, kinship and clan, the trees that hold a
            household, and the words of greeting — drawn from the work of {site.author}.
          </p>
          <form action="/explore" className="search" role="search">
            <label htmlFor="q" className="sr-only">Search the record</label>
            <input id="q" name="q" type="search" placeholder="Search: omugolo, kraal, greeting…" />
            <button type="submit">Search</button>
          </form>
        </div>
      </Plate>

      <section className="section" aria-labelledby="stories">
        <div className="wrap">
          <div className="section__head">
            <h2 id="stories">Doorways into the record</h2>
            <Link href="/explore">See all {entries.length}</Link>
          </div>
          <div className="row">
            {story.map((e) => (
              <StoryCard key={e.id} entry={e} collectionTitle={titleOf.get(e.collection)} showSummary={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="collections" aria-labelledby="coll">
        <div className="wrap">
          <div className="section__head">
            <h2 id="coll">Six collections</h2>
          </div>
          <div className="tiles">
            {collections.map((c) => (
              <CollectionTile key={c.slug} c={c} inPreview={entries.filter((e) => e.collection === c.slug).length} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="dialects">
        <div className="wrap split">
          <div>
            <p className="eyebrow">The Aawambo</p>
            <div className="big-number" aria-hidden="true">14</div>
            <h2 id="dialects" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "1rem 0" }}>
              Fourteen dialects, one language cluster
            </h2>
            <p style={{ maxWidth: "30rem", color: "var(--ink-soft)" }}>{people.summary} {people.censusNote}</p>
            <Attribution keys={[people.source]} />
          </div>
          <ol className="dialects">
            {dialects.map((d, i) => (
              <li key={d}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {core ? (
        <section className="section" aria-labelledby="book">
          <div className="wrap featured-book">
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
              <p className="eyebrow">The core book</p>
              <h2 id="book">{core.title}</h2>
              {core.subtitle ? <p className="osh">{core.subtitle}</p> : null}
              <p>{core.blurb} Every doorway on this site is a summary; the full account is in the author’s books.</p>
              <Link href="/books">All books by {site.author}</Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
