import Link from "next/link";
import type { Entry } from "@shookuku/content";
import { Plate } from "./Plate";
import { StatusBadge } from "./StatusBadge";

export function StoryCard({ entry, collectionTitle, showSummary = true }: { entry: Entry; collectionTitle?: string; showSummary?: boolean }) {
  return (
    <Link href={`/stories/${entry.id}`} className="card">
      <Plate image={entry.image} tone={entry.tone} alt={entry.title} word={entry.osh?.split(" / ")[0]} />
      <div className="meta">
        {collectionTitle ? <span>{collectionTitle}</span> : null}
        <StatusBadge status={entry.status} />
      </div>
      <h3>{entry.title}</h3>
      {entry.osh ? <span className="osh">{entry.osh}</span> : null}
      {showSummary ? <p>{entry.summary}</p> : null}
    </Link>
  );
}
