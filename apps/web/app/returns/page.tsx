import { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Cancellations" };

const sections = [
  {
    title: "Return Window",
    body: "You may return most items within 30 days of delivery for a full refund. Items must be unused, in original packaging, and accompanied by proof of purchase.",
  },
  {
    title: "Non-Returnable Items",
    body: "For hygiene and safety reasons, certain items cannot be returned — including perishable goods, intimate wear, and digital downloads.",
  },
  {
    title: "How to Initiate a Return",
    body: "Sign in to your account, go to My Orders, select the order and item you wish to return, and follow the on-screen instructions. Our team will arrange a pickup.",
  },
  {
    title: "Refund Processing",
    body: "Once we receive and inspect the returned item, your refund will be processed within 5–7 business days to your original payment method.",
  },
  {
    title: "Order Cancellation",
    body: "You can cancel an order within 1 hour of placing it, provided it has not yet been dispatched. Go to My Orders and select 'Cancel Order'.",
  },
  {
    title: "Damaged or Wrong Items",
    body: "If you received a damaged or incorrect item, contact us immediately at support@megamart.com with photos. We will arrange a free replacement or full refund.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Returns & Cancellations</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
