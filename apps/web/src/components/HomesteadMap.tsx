import Link from "next/link";
import type { BookPage, Entry } from "@shookuku/content";

/**
 * The homestead plan from the cover of Ando okwa li ihe.
 * Markers appear only for catalogue stories whose place the drawing itself shows.
 * The book numbers 34 places; we do not guess which number is which.
 */
export function HomesteadMap({ map, stories }: { map: BookPage; stories: Entry[] }) {
  const placed = stories.filter((s) => s.mapPoint);
  const unplaced = stories.filter((s) => !s.mapPoint);
  return (
    <figure className="hmap">
      <div className="hmap__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={map.src} width={map.width} height={map.height} alt={map.alt} loading="lazy" />
        {placed.map((s, i) => (
          <Link
            key={s.id}
            href={`/stories/${s.id}`}
            className="hmap__pin"
            style={{ left: `${s.mapPoint!.x}%`, top: `${s.mapPoint!.y}%` }}
            aria-label={`${i + 1}: ${s.title}`}
          >
            <span aria-hidden="true">{i + 1}</span>
          </Link>
        ))}
      </div>
      <figcaption>
        <p className="hmap__cap">
          {map.caption}, from <cite>Ando okwa li ihe to shanga opo waa dhimbwe</cite> (2021). Illustrated by Max Shimi and
          Kashindi Asuiku. Clay markers are ours, not the book’s numbers.
        </p>
        <ol className="hmap__key">
          {placed.map((s, i) => (
            <li key={s.id}>
              <span className="hmap__num" aria-hidden="true">{i + 1}</span>
              <div>
                <Link href={`/stories/${s.id}`}>{s.title}</Link>
                {s.osh ? <em className="osh"> {s.osh}</em> : null}
                <small>{s.mapPoint!.basis}</small>
              </div>
            </li>
          ))}
        </ol>
        {unplaced.length ? (
          <p className="hmap__unplaced">
            Not yet marked on the drawing:{" "}
            {unplaced.map((s, i) => (
              <span key={s.id}>
                {i ? ", " : ""}
                <Link href={`/stories/${s.id}`}>{s.title.replace(/^The /, "the ")}</Link>
              </span>
            ))}
            . They will be placed once the book’s key to its numbered places is confirmed.
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
