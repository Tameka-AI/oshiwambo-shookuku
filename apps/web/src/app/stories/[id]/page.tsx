import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site, STATUS_LABEL } from "@shookuku/content";
import { getCollection, getEntries, getEntry } from "@/lib/data";
import { Plate } from "@/components/Plate";
import { StatusBadge } from "@/components/StatusBadge";
import { Attribution } from "@/components/Attribution";

type Params = { params: Promise<{ id: string }> };


export async function generateStaticParams() {
  return (await getEntries()).map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await getEntry((await params).id);
  if (!e) return {};
  return { title: e.osh ? `${e.title} (${e.osh})` : e.title, description: e.summary };
}

export default async function StoryPage({ params }: Params) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();
  const [collection, all] = await Promise.all([getCollection(entry.collection), getEntries()]);
  const siblings = all.filter((e) => e.collection === entry.collection);
  const i = siblings.findIndex((e) => e.id === entry.id);
  const prev = siblings[i - 1];
  const next = siblings[i + 1];

  return (
    <article>
      <Plate image={entry.image} tone={entry.tone} alt={entry.title} word={entry.osh?.split(" / ")[0] ?? entry.title} className="story-hero" priority />
      <div className="wrap story">
        <div>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/explore">Explore</Link>
            <span aria-hidden="true">/</span>
            {collection ? <Link href={`/collections/${collection.slug}`}>{collection.title}</Link> : null}
          </nav>
          <StatusBadge status={entry.status} />
          <h1 style={{ marginTop: "0.75rem" }}>{entry.title}</h1>
          {entry.osh ? <p className="osh osh-title">{entry.osh}</p> : null}

          <p className="lede">{entry.summary}</p>

          <dl className="facts">
            <div><dt>Who</dt><dd>{entry.who}</dd></div>
            <div><dt>When</dt><dd>{entry.when}</dd></div>
            <div><dt>Where</dt><dd>{entry.where}</dd></div>
            <div><dt>Why</dt><dd>{entry.why}</dd></div>
          </dl>

          {entry.status !== "unspecified" && entry.statusBasis ? (
            <div className="basis">
              <span>Why this is marked “{STATUS_LABEL[entry.status].toLowerCase()}”:</span>
              <blockquote>“{entry.statusBasis}”</blockquote>
            </div>
          ) : (
            <div className="basis">
              The author’s paper does not say whether this is still practised today, so no status is shown.
            </div>
          )}

          <div className="notice">
            <Attribution keys={entry.sources} lead="Summarised from" />
            <p>
              This is a doorway, not the full account. The complete description stays with {site.author} until he
              releases it. <Link href="/books/ando-okwa-li-ihe">Read it in his books</Link>.
            </p>
          </div>

          <nav className="pager" aria-label="More in this collection">
            {prev ? <Link href={`/stories/${prev.id}`}>← {prev.title}</Link> : <span />}
            {next ? <Link href={`/stories/${next.id}`}>{next.title} →</Link> : <span />}
          </nav>
        </div>

        <aside className="aside" aria-label="In this collection">
          {collection ? (
            <>
              <h2>
                In <Link href={`/collections/${collection.slug}`}>{collection.title}</Link>
              </h2>
              <ul className="mini">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <Link href={`/stories/${s.id}`} aria-current={s.id === entry.id ? "page" : undefined}>
                      <span style={s.id === entry.id ? { color: "var(--clay)" } : undefined}>{s.title}</span>
                      <span>{STATUS_LABEL[s.status]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
