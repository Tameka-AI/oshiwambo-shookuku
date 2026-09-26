"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNad } from "@shookuku/content";
import { loadOrders, METHOD_LABEL, type Order } from "@/lib/cart";

export function OrderView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => {
    setOrder(loadOrders().find((o) => o.id === id) ?? null);
  }, [id]);

  return (
    <>
      <p className="eyebrow">Order {id}</p>
      <h1>{order?.name ? `Thank you, ${order.name}` : "Thank you"}</h1>
      <p className="demo-stamp">Demonstration. No payment was taken.</p>

      {order ? (
        <div className="order">
          <ul className="checkout__lines">
            {order.lines.map((l) => (
              <li key={l.id}>
                <span>{l.qty} × {l.title}</span>
                <span>{formatNad(l.priceNad * l.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="order__total">
            <span>Total (preview prices)</span>
            <strong>{formatNad(order.totalNad)}</strong>
          </p>
          <dl className="facts">
            <div><dt>Method</dt><dd>{METHOD_LABEL[order.method]}</dd></div>
            {order.town ? <div><dt>Town</dt><dd>{order.town}</dd></div> : null}
          </dl>
          <p className="fine-print">
            When the shop opens, the publisher will confirm orders and payment directly. This preview sends nothing.
          </p>
        </div>
      ) : order === null ? (
        <p>This order was placed in another browser, or its record has been cleared.</p>
      ) : null}

      <p style={{ marginTop: "2rem" }}>
        <Link href="/books">Back to the books</Link>
      </p>
    </>
  );
}
