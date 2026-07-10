import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing and using MegaMart, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Use of Service",
    body: "You agree to use MegaMart only for lawful purposes. You must not misuse our platform, attempt to gain unauthorised access, or engage in fraudulent activity.",
  },
  {
    title: "3. Orders & Payments",
    body: "All orders are subject to availability and confirmation. Prices are displayed in USD and may change without notice. Payment must be completed before an order is processed.",
  },
  {
    title: "4. Returns & Refunds",
    body: "We offer a 30-day return policy on most items. Products must be in original condition and packaging. Refunds are processed within 5–7 business days.",
  },
  {
    title: "5. Intellectual Property",
    body: "All content on MegaMart — including logos, images, and text — is the property of MegaMart and protected by copyright laws.",
  },
  {
    title: "6. Limitation of Liability",
    body: "MegaMart is not liable for any indirect or consequential damages arising from the use of our platform or products purchased through it.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
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
