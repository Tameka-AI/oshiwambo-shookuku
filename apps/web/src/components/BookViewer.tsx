"use client";

import { useState } from "react";
import type { BookDetails } from "@shookuku/content";

type View = "front" | "back" | "inside";

/**
 * Cover / Back / Look inside. Buttons only, no autoplay.
 * The flip is a CSS 3D rotation; under prefers-reduced-motion the CSS removes
 * the transition so the faces swap instantly.
 */
export function BookViewer({ d }: { d: BookDetails }) {
  const [view, setView] = useState<View>("front");
  const [page, setPage] = useState(0);
  const pages = d.lookInside.slice(0, 3);
  const current = pages[page];

  return (
    <div className="viewer">
      <div className="viewer__stage">
        <div className={`flip ${view === "inside" ? "is-hidden" : ""}`} aria-hidden={view === "inside"}>
          <div className={`flip__card ${view === "back" ? "is-back" : ""}`}>
            <figure className="flip__face flip__face--front" aria-hidden={view === "back"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.front.src} width={d.front.width} height={d.front.height} alt={d.front.alt} fetchPriority="high" />
            </figure>
            <figure className="flip__face flip__face--back" aria-hidden={view !== "back"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.back.src} width={d.back.width} height={d.back.height} alt={d.back.alt} loading="lazy" />
            </figure>
          </div>
        </div>

        <div className={`inside ${view === "inside" ? "is-shown" : ""}`} aria-hidden={view !== "inside"}>
          {pages.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              width={p.width}
              height={p.height}
              alt={p.alt}
              loading="lazy"
              className={i === page ? "is-current" : ""}
              aria-hidden={i !== page}
            />
          ))}
        </div>
      </div>

      <p className="viewer__caption" aria-live="polite">
        {view === "front" ? d.front.caption : view === "back" ? d.back.caption : `${current.caption} · ${page + 1} of ${pages.length}`}
      </p>

      <div className="viewer__controls" role="group" aria-label="View the book">
        <button type="button" className="chip" aria-pressed={view === "front"} onClick={() => setView("front")}>Cover</button>
        <button type="button" className="chip" aria-pressed={view === "back"} onClick={() => setView("back")}>Back</button>
        <button type="button" className="chip" aria-pressed={view === "inside"} onClick={() => setView("inside")}>Look inside</button>
      </div>

      {view === "inside" ? (
        <div className="viewer__pager" role="group" aria-label="Pages">
          <button type="button" className="chip" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Previous page</button>
          <button type="button" className="chip" disabled={page === pages.length - 1} onClick={() => setPage((p) => p + 1)}>Next page →</button>
        </div>
      ) : null}
      {view === "inside" ? (
        <p className="viewer__note">Three pages only. The rest is in the book.</p>
      ) : null}
    </div>
  );
}
