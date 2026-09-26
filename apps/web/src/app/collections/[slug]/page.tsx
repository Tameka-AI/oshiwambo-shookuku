import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBooks, getCollection, getCollections, getEntriesFor } from "@/lib/data";
import { HomesteadMap } from "@/components/HomesteadMap";
import { Plate } from "@/components/Plate";
import { StoryCard } from "@/components/StoryCard";
import { Attribution } from "@/components/Attribution";
import { countLabel } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };


export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = await getCollection((await params).slug);
  return c ? { title: c.title, description: c.blurb } : {};
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) notFound();
  const list = await getEntriesFor(slug);
  const map = slug === "homestead" ? (await getBooks()).find((b) => b.details?.homesteadMap)?.details?.homesteadMap : undefined;

  return (
    <>
      <Plate image={c.image} tone={c.tone} alt={c.title} word={c.osh} className="coll-hero" priority>
        <div className="wrap">
          <p className="eyebrow">Collection · {countLabel(c, list.length)}</p>
          {c.osh ? <span className="osh">{c.osh}</span> : null}
          <h1>{c.title}</h1>
          <p>{c.blurb}</p>
        </div>
      </Plate>
      <section className="section">
        <div className="wrap">
          <div style={{ marginBottom: "2.5rem", maxWidth: "38rem" }}>
            <Attribution keys={[c.source]} lead="Doorways summarised from" />
          </div>
          {map ? (
            <div style={{ marginBottom: "4rem" }}>
              <HomesteadMap map={map} stories={list} />
            </div>
          ) : null}
          <div className="grid">
            {list.map((e) => (
              <StoryCard key={e.id} entry={e} />
            ))}
          </div>
          {c.sourceCount && list.length < c.sourceCount.n ? (
            <p className="notice">
              The author’s paper covers {c.sourceCount.n} {c.sourceCount.unit}. The others will be added as he
              releases them.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
