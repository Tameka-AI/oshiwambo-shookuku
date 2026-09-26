import type { Collection } from "@shookuku/content";

/** “5 of 14 places in this preview” when the source counts them; otherwise “3 entries in this preview”. */
export function countLabel(c: Collection, inPreview: number) {
  if (c.sourceCount) return `${inPreview} of ${c.sourceCount.n} ${c.sourceCount.unit} in this preview`;
  return `${inPreview} ${inPreview === 1 ? "entry" : "entries"} in this preview`;
}
