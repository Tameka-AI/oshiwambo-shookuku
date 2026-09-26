import type { Metadata } from "next";
import Link from "next/link";
import { site, sources, STATUS_LABEL } from "@shookuku/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.author}, and the publishing rule.`,
};

export default function AboutPage() {
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">About</p>
        <h1>{site.name}</h1>
        <p className="osh" style={{ fontSize: "1.4rem" }}>{site.line} — {site.lineEn.toLowerCase()}</p>
      </header>
      <div className="wrap">
        <div className="prose">
          <p>
            {site.name} is a public record of Oshiwambo life drawn from the work of {site.author}: the homestead, the
            ceremonies of a life, marriage, kinship and clan, plants, and greeting.
          </p>

          <h2>The name</h2>
          <p>
            <em>Shookuku</em> refers to the ancestors. The line beneath the name, <em>{site.line}</em>, “in the
            footsteps of our ancestors”, is an old radio phrase. <em>Omuthigululwakalo</em> is the title of the
            professor’s core book, <em>{site.coreBook}</em>. It is not the name of this site.
          </p>

          <h2>The author</h2>
          <p>
            {site.author} has written dictionaries, biographies, and studies of Aawambo culture, clans, and language
            over three decades. His titles are listed in the <Link href="/books">bookstore</Link>.
          </p>

          <p className="pull">The site shows doorways, not the book.</p>

          <h2>The publishing rule</h2>
          <ul>
            <li>Every page is a short summary of one of the professor’s papers, and names that paper.</li>
            <li>Full procedures stay in his files until he releases them. Nothing here replaces his books.</li>
            <li>No ritual step is invented, and no Oshiwambo term is used that his papers do not use.</li>
            <li>
              A practice is marked “{STATUS_LABEL.living}”, “{STATUS_LABEL.fading}”, or “{STATUS_LABEL.historical}” only
              when his text says so. The sentence is quoted on the page. Otherwise it reads “{STATUS_LABEL.unspecified}”.
            </li>
            <li>Dialect differences are part of the record, not footnotes.</li>
          </ul>

          <h2>The papers behind this preview</h2>
          <ul>
            {Object.values(sources).map((s) => (
              <li key={s.file}><em>{s.title}</em></li>
            ))}
          </ul>

          <h2>Domain and build</h2>
          <p>
            The permanent address will be <strong>{site.domain}</strong>. The site is built by {site.org} and its
            source lives at github.com/{site.org}/oshiwambo-shookuku.
          </p>
          <p>
            Photographs will be the professor’s own. Until they arrive, earth-tone plates stand in for them rather
            than stock images.
          </p>
        </div>
      </div>
    </>
  );
}
