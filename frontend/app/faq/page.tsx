import { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add items to your cart, sign in to your account, then click 'Place Order' on the cart page." },
  { q: "Can I track my order?", a: "Yes! Once signed in, go to My Orders from the header menu or visit /account/orders to see all your orders and their status." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards, as well as digital wallets. Payment is processed securely at checkout." },
  { q: "How long does delivery take?", a: "Delivery times vary by location. Standard delivery takes 3–7 business days. Express options may be available at checkout." },
  { q: "Can I return a product?", a: "Yes, we have a 30-day return policy. Items must be in original condition. Visit our Returns page for full details." },
  { q: "Is my personal information safe?", a: "Absolutely. We use industry-standard encryption and never sell your personal data. Read our Privacy Policy for full details." },
  { q: "How do I contact customer support?", a: "Call us on 08142293610 or email support@megamart.com. We're available Monday–Friday, 9am–6pm." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-10">Everything you need to know about MegaMart.</p>
        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="border border-border rounded-xl p-6">
              <h2 className="text-base font-semibold text-foreground mb-2">{item.q}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
