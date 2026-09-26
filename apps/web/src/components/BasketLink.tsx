"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function BasketLink({ current }: { current: boolean }) {
  const n = useCart().reduce((s, l) => s + l.qty, 0);
  return (
    <Link href="/cart" aria-current={current ? "page" : undefined} aria-label={n ? `Basket, ${n} ${n === 1 ? "item" : "items"}` : "Basket"}>
      Basket{n ? <span className="basket-count">{n}</span> : null}
    </Link>
  );
}
