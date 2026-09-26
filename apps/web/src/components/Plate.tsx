import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Tone } from "@shookuku/content";

type Props = {
  image?: string;
  tone: Tone;
  alt: string;
  /** Oshiwambo word set faintly into the stand-in plate */
  word?: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
};

/** True only if the file is actually in public/. Paths from the catalog are placeholders until photographs arrive. */
function hasFile(src?: string) {
  if (!src || !src.startsWith("/")) return Boolean(src);
  try {
    return existsSync(join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

/**
 * A photograph when one exists; otherwise an earth-tone plate.
 * The stand-in is honest: it carries no fake imagery, only tone and the entry’s own word.
 */
export function Plate({ image, tone, alt, word, className = "", children, priority }: Props) {
  const real = hasFile(image);
  return (
    <div className={`plate tone-${tone} ${real ? "" : "plate--stand"} ${className}`}>
      {real ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} loading={priority ? "eager" : "lazy"} />
      ) : (
        <>
          {word ? <span className="plate__word" aria-hidden="true">{word}</span> : null}
        </>
      )}
      {children}
    </div>
  );
}
