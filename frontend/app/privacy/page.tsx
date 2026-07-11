import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly — such as your name, email, and order details — as well as usage data when you browse our platform.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to process orders, send order updates, improve our services, and occasionally send promotional emails (which you can opt out of at any time).",
  },
  {
    title: "Data Sharing",
    body: "We do not sell your personal data. We only share data with trusted third-party services necessary to operate our platform (e.g. payment processors, delivery partners).",
  },
  {
    title: "Cookies",
    body: "We use cookies to improve your browsing experience and remember your preferences. You can disable cookies in your browser settings at any time.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, or delete your personal data at any time. Contact us at support@megamart.com to make a request.",
  },
  {
    title: "Security",
    body: "We take reasonable measures to protect your data. However, no method of transmission over the internet is 100% secure.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
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
