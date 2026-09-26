/**
 * `unspecified` is the default. Use living / fading / historical only when a
 * sentence in the named source paper supports it, and put that sentence in
 * `statusBasis`.
 */
export type Status = "living" | "fading" | "historical" | "unspecified";

export const STATUSES: readonly Status[] = ["living", "fading", "historical", "unspecified"];

export const STATUS_LABEL: Record<Status, string> = {
  living: "Still lived",
  fading: "Fading",
  historical: "Historical",
  unspecified: "Status not stated",
};

export type SourceFile = {
  /** Markdown file name under docs/source */
  file: string;
  /** Title as the professor’s Word file names it */
  title: string;
};

export type Entry = {
  id: string;
  title: string;
  osh?: string;
  collection: string;
  status: Status;
  /** Verbatim sentence from the source that justifies the status. Required unless status is unspecified. */
  statusBasis?: string;
  summary: string;
  who: string;
  when: string;
  where: string;
  why: string;
  /** Source papers this teaser draws on (keys of `sources`). First is primary. */
  sources: SourceKey[];
  /** Released text from the professor. Empty until he marks it publishable. */
  bodyMd?: string;
  image?: string;
  tone: Tone;
  /**
   * Position on the cover drawing (07-homestead-map), in % of width/height.
   * Only set where the drawing itself shows the place; `basis` says how it was located.
   */
  mapPoint?: { x: number; y: number; basis: string; provisional?: boolean };
};

export type Collection = {
  slug: string;
  title: string;
  /** Oshiwambo name, only where the term appears in the author’s files */
  osh?: string;
  blurb: string;
  source: SourceKey;
  /** How many items the source paper itself covers, when it counts them */
  sourceCount?: { n: number; unit: string };
  image?: string;
  tone: Tone;
};

export type Book = {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  publisher: string;
  language: string;
  category: string;
  featured: boolean;
  blurb: string;
  /** Only set when a real purchase or publisher-contact link exists */
  buyUrl?: string;
  /** Preview price in Namibian dollars. Shown as “preview”; no payment is taken. */
  priceNad: number;
  /** Photograph of the real cover, when we have one */
  cover?: string;
  /** Facts read from the physical copy. Only for titles we have handled. */
  details?: BookDetails;
};

export type BookPage = { src: string; alt: string; caption: string; width: number; height: number };

export type BookDetails = {
  titleOnCover: string;
  author: string;
  publisherFull: string;
  place: string;
  printer: string;
  isbn: string;
  illustrators: string;
  front: BookPage;
  back: BookPage;
  /** Three pages at most. The rest is the book. */
  lookInside: BookPage[];
  colophon: BookPage;
  homesteadMap?: BookPage;
};

/** Earth-tone plate used until the professor’s photographs arrive. */
export type Tone = "clay" | "sand" | "moss" | "ochre" | "ash" | "dusk";

export type SourceKey =
  | "description"
  | "rituals"
  | "homestead"
  | "marriage"
  | "kinship"
  | "ethnobotany"
  | "greetings";
