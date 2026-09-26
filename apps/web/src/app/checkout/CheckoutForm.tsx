"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatNad } from "@shookuku/content";
import { clearCart, METHOD_LABEL, newOrderId, saveOrder, useHydrated, type OrderMethod } from "@/lib/cart";
import { useBasket, type ShopBook } from "../cart/CartView";

const METHOD_NOTE: Record<OrderMethod, string> = {
  eft: "Bank details will come from the publisher when the shop opens. None are shown in this preview.",
  collect: "The collection point in Windhoek will be confirmed by the publisher.",
  "card-demo": "Card payment is shown for demonstration only. There are no card fields, and no card details are asked for.",
};

export function CheckoutForm({ books }: { books: ShopBook[] }) {
  const router = useRouter();
  const { rows, totalNad } = useBasket(books);
  const [method, setMethod] = useState<OrderMethod>("eft");
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const hydrated = useHydrated();

  if (!hydrated) return <p className="count">Opening your basket…</p>;
  if (placing) return <p className="count">Placing your demonstration order…</p>;
  if (!rows.length) {
    return (
      <div className="empty-cart">
        <p className="empty">Your basket is empty.</p>
        <Link href="/books" className="btn">Browse the books</Link>
      </div>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setError("Please complete the required fields.");
      return;
    }
    const f = new FormData(form);
    const id = newOrderId();
    saveOrder({
      id,
      createdAt: new Date().toISOString(),
      lines: rows.map((r) => ({ id: r.id, title: r.title, priceNad: r.priceNad, qty: r.qty })),
      totalNad,
      method,
      // Only the first name and town are kept, for the thank-you page. Email and phone are discarded.
      name: String(f.get("name") ?? "").trim().split(/\s+/)[0] ?? "",
      town: String(f.get("town") ?? "").trim(),
    });
    setPlacing(true);
    clearCart();
    router.push(`/order/${encodeURIComponent(id)}`);
  }

  return (
    <form className="checkout" onSubmit={submit} onChange={() => error && setError(null)} noValidate>
      <div className="checkout__fields">
        <fieldset>
          <legend>Your details</legend>
          <label>
            Name
            <input name="name" autoComplete="name" required maxLength={120} />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={200} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" autoComplete="tel" required inputMode="tel" pattern={"[0-9 +\\(\\)\\-]{7,20}"} maxLength={20} />
          </label>
          <label>
            Town
            <input name="town" autoComplete="address-level2" required maxLength={80} />
          </label>
          <label>
            Note <span className="optional">(optional)</span>
            <textarea name="note" rows={3} maxLength={500} />
          </label>
        </fieldset>

        <fieldset>
          <legend>How you would pay</legend>
          {(Object.keys(METHOD_LABEL) as OrderMethod[]).map((m) => (
            <label key={m} className="radio">
              <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} />
              <span>{METHOD_LABEL[m]}</span>
            </label>
          ))}
          <p className="fine-print" aria-live="polite">{METHOD_NOTE[method]}</p>
        </fieldset>
      </div>

      <aside className="cart__sum">
        <ul className="checkout__lines">
          {rows.map((r) => (
            <li key={r.id}>
              <span>{r.qty} × {r.title}</span>
              <span>{formatNad(r.lineNad)}</span>
            </li>
          ))}
        </ul>
        <p>
          <span>Total</span>
          <strong>{formatNad(totalNad)}</strong>
        </p>
        <p className="fine-print">Preview prices. Demonstration only. No payment is taken.</p>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button type="submit" className="btn">Place demonstration order</button>
        <Link href="/cart" className="back-link">← Back to basket</Link>
      </aside>
    </form>
  );
}
