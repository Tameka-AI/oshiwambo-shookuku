import Link from "next/link";
import { site } from "@shookuku/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <b>{site.name}</b>
          <i>{site.line} — {site.lineEn.toLowerCase()}</i>
          <p>
            A public record drawn from the work of {site.author}. Every page is a short, attributed doorway.
            The full accounts stay in his books and papers until he releases them.
          </p>
        </div>
        <ul aria-label="Pages">
          <li><Link href="/explore">Explore the record</Link></li>
          <li><Link href="/#collections">Collections</Link></li>
          <li><Link href="/books">Books by the author</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <ul aria-label="Record">
          <li>{site.domain}</li>
          <li>Built by {site.org}</li>
        </ul>
        <p className="fine">
          Text © {site.author}. Teasers are summaries of his working papers, not the books themselves.
        </p>
      </div>
    </footer>
  );
}
