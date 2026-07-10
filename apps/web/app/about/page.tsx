import { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">About MegaMart</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          MegaMart is your one-stop destination for the best deals on electronics, fashion, furniture,
          smartphones and more — delivered worldwide.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We partner with top brands and trusted sellers to bring you quality products at unbeatable
          prices. Our mission is to make premium shopping accessible to everyone, everywhere.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Built with passion by <span className="text-primary font-semibold">Darey Olowo</span>.
        </p>
      </div>
    </div>
  );
}
