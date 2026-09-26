import type { Metadata } from "next";
import { getBooks } from "@/lib/data";
import { PreviewBanner } from "@/components/PreviewBanner";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Basket", robots: { index: false } };

export default async function CartPage() {
  const books = (await getBooks()).map(({ id, title, subtitle, priceNad, cover, year }) => ({ id, title, subtitle, priceNad, cover, year }));
  return (
    <>
      <PreviewBanner />
      <header className="wrap page-head">
        <p className="eyebrow">Preview shop</p>
        <h1>Basket</h1>
      </header>
      <div className="wrap">
        <CartView books={books} />
      </div>
    </>
  );
}
