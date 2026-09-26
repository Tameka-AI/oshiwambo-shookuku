"use client";

import Link from "next/link";
import { formatNad } from "@shookuku/content";
import { setQty, useCart, useHydrated } from "@/lib/cart";

export type ShopBook = { id: string; title: string; subtitle?: string; priceNad: number; cover?: string; year: number };

export function useBasket(books: ShopBook[]) {
  const lines = useCart();
  const byId = new Map(books.map((b) => [b.id, b]));
  const rows = lines.flatMap((l) => {
    const b = byId.get(l.id);
    return b ? [{ ...b, qty: l.qty, lineNad: b.priceNad * l.qty }] : [];
  });
  return { rows, totalNad: rows.reduce((s, r) => s + r.lineNad, 0), count: rows.reduce((s, r) => s + r.qty, 0) };
}

export function CartView({ books }: { books: ShopBook[] }) {
  const { rows, totalNad, count } = useBasket(books);
  const hydrated = useHydrated();

  if (!hydrated) return <p className="count">Opening your basket…</p>;
  if (!rows.length) {
    return (
      <div className="empty-cart">
        <p className="empty">Your basket is empty.</p>
        <Link href="/books" className="btn">Browse the books</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="cart__lines">
        {rows.map((r) => (
          <li key={r.id}>
            <div className="cart__thumb">
              {r.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.cover} width={625} height={900} alt="" loading="lazy" />
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
            <div className="cart__info">
              <Link href={`/books/${r.id}`} className="plain cart__title">{r.title}</Link>
              {r.subtitle ? <span className="sub">{r.subtitle}</span> : null}
              <span className="cart__unit">{formatNad(r.priceNad)} each · preview price</span>
            </div>
            <div className="qty" role="group" aria-label={`Quantity of ${r.title}`}>
              <button type="button" onClick={() => setQty(r.id, r.qty - 1)} aria-label="One fewer">−</button>
              <output aria-live="polite">{r.qty}</output>
              <button type="button" onClick={() => setQty(r.id, r.qty + 1)} aria-label="One more">+</button>
            </div>
            <div className="cart__line">{formatNad(r.lineNad)}</div>
            <button type="button" className="linkish" onClick={() => setQty(r.id, 0)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="cart__sum">
        <p>
          <span>{count} {count === 1 ? "book" : "books"}</span>
          <strong>{formatNad(totalNad)}</strong>
        </p>
        <p className="fine-print">Preview prices. Delivery is arranged with the publisher. No payment is taken.</p>
        <Link href="/checkout" className="btn">Continue to checkout</Link>
      </div>
    </div>
  );
}
