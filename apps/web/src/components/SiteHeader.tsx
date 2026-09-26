"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@shookuku/content";
import { BasketLink } from "./BasketLink";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/#collections", label: "Collections" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          <b>{site.name}</b>
          <i>{site.line}</i>
        </Link>
        <nav className="nav" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href || (l.href !== "/#collections" && path.startsWith(l.href + "/")) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <BasketLink current={path === "/cart" || path === "/checkout"} />
        </nav>
      </div>
    </header>
  );
}
