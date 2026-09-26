"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart, useCart } from "@/lib/cart";

export function AddToBasket({ id, title }: { id: string; title: string }) {
  const lines = useCart();
  const [added, setAdded] = useState(false);
  const inBasket = lines.find((l) => l.id === id)?.qty ?? 0;
  return (
    <div className="add">
      <button
        type="button"
        className="btn"
        onClick={() => {
          addToCart(id);
          setAdded(true);
        }}
        aria-label={`Add ${title} to basket`}
      >
        Add to basket
      </button>
      <span className="add__status" aria-live="polite">
        {inBasket > 0 ? (
          <>
            {added ? "Added. " : ""}
            {inBasket} in <Link href="/cart">basket</Link>
          </>
        ) : null}
      </span>
    </div>
  );
}
