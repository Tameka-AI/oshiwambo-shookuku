import Link from "next/link";
import type { Collection } from "@shookuku/content";
import { Plate } from "./Plate";
import { countLabel } from "@/lib/format";

export function CollectionTile({ c, inPreview }: { c: Collection; inPreview: number }) {
  return (
    <Link href={`/collections/${c.slug}`} className="tile">
      <Plate image={c.image} tone={c.tone} alt={c.title}>
        <div>
          {c.osh ? <span className="osh">{c.osh}</span> : null}
          <h3>{c.title}</h3>
        </div>
      </Plate>
      <p>{c.blurb}</p>
      <small>{countLabel(c, inPreview)}</small>
    </Link>
  );
}
