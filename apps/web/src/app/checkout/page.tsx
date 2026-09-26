import type { Metadata } from "next";
import { getBooks } from "@/lib/data";
import { PreviewBanner } from "@/components/PreviewBanner";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const books = (await getBooks()).map(({ id, title, subtitle, priceNad, cover, year }) => ({ id, title, subtitle, priceNad, cover, year }));
  return (
    <>
      <PreviewBanner />
      <header className="wrap page-head">
        <p className="eyebrow">Preview shop</p>
        <h1>Checkout</h1>
        <p>This is a demonstration of how ordering will work. Nothing is charged and nothing leaves your browser.</p>
      </header>
      <div className="wrap">
        <CheckoutForm books={books} />
      </div>
    </>
  );
}
