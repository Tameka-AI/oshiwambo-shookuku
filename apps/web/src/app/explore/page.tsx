import { Suspense } from "react";
import type { Metadata } from "next";
import { getBooks, getCollections, getEntries } from "@/lib/data";
import { ExploreClient, ExploreView } from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description: "Search the record and filter by collection and by whether a practice is still lived.",
};

export default async function ExplorePage() {
  const [entries, collections, books] = await Promise.all([getEntries(), getCollections(), getBooks()]);
  const shortCollections = collections.map((c) => ({ slug: c.slug, title: c.title }));
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">Explore</p>
        <h1>Search the record</h1>
        <p>
          Every entry is a short doorway into Professor Mbenzi’s work. Filter by collection, or by whether the author
          states that a practice is still lived. No account needed.
        </p>
      </header>
      <div className="wrap">
        <Suspense fallback={<ExploreView entries={entries} collections={shortCollections} books={books} q="" collection="" />}>
          <ExploreClient entries={entries} collections={shortCollections} books={books} />
        </Suspense>
      </div>
    </>
  );
}
