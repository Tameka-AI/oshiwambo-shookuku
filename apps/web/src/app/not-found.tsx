import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-head">
      <p className="eyebrow">Not in the record</p>
      <h1>This page is not here</h1>
      <p>
        It may not have been released yet. <Link href="/explore">Search the record</Link> or go <Link href="/">home</Link>.
      </p>
    </div>
  );
}
