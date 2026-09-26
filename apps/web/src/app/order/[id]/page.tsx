import type { Metadata } from "next";
import { PreviewBanner } from "@/components/PreviewBanner";
import { OrderView } from "./OrderView";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PreviewBanner />
      <div className="wrap page-head">
        <OrderView id={decodeURIComponent(id)} />
      </div>
    </>
  );
}
