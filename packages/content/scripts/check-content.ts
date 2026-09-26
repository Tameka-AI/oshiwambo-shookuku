/**
 * Content rules, enforced:
 *  1. A non-"unspecified" status must carry a statusBasis found in one of the entry's sources.
 *  2. Every entry and collection references a real source file.
 *  3. Entry ids are unique and every entry belongs to a known collection.
 *  4. Teasers stay short (summary ≤ 70 words) so the site never becomes the book.
 * Run from the repo root or this package: node --experimental-strip-types scripts/check-content.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collections, entries, sources } from "../src/catalog.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const srcDir = resolve(root, "docs/source");
const squash = (s: string) => s.replace(/\s+/g, "").replace(/[’‘]/g, "'").toLowerCase();

const errors: string[] = [];
const text: Record<string, string> = {};
for (const [k, s] of Object.entries(sources)) {
  const p = resolve(srcDir, s.file);
  if (!existsSync(p)) errors.push(`source ${k}: missing ${s.file}`);
  else text[k] = squash(readFileSync(p, "utf8"));
}

const ids = new Set<string>();
const slugs = new Set(collections.map((c) => c.slug));
for (const c of collections) if (!sources[c.source]) errors.push(`collection ${c.slug}: unknown source`);

for (const e of entries) {
  if (ids.has(e.id)) errors.push(`duplicate id ${e.id}`);
  ids.add(e.id);
  if (!slugs.has(e.collection)) errors.push(`${e.id}: unknown collection ${e.collection}`);
  if (!e.sources.length) errors.push(`${e.id}: no source`);
  if (e.status !== "unspecified") {
    if (!e.statusBasis) errors.push(`${e.id}: status ${e.status} without statusBasis`);
    else if (!e.sources.some((k) => text[k]?.includes(squash(e.statusBasis!))))
      errors.push(`${e.id}: statusBasis not found verbatim in its sources`);
  }
  const words = e.summary.split(/\s+/).length;
  if (words > 70) errors.push(`${e.id}: summary is ${words} words (max 70)`);
}

if (errors.length) {
  console.error("Content check failed:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`Content check passed: ${entries.length} entries, ${collections.length} collections.`);
