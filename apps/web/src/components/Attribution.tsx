import { site, sources, type SourceKey } from "@shookuku/content";

export function Attribution({ keys, lead = "From" }: { keys: SourceKey[]; lead?: string }) {
  const titles = [...new Set(keys)].map((k) => sources[k].title);
  return (
    <p className="attribution">
      {lead} {site.author}’s{" "}
      {titles.map((t, i) => (
        <span key={t}>
          {i > 0 ? (i === titles.length - 1 ? " and " : ", ") : null}
          <cite>{t}</cite>
        </span>
      ))}
      .
    </p>
  );
}
