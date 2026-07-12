import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import ModernHeader from "./_components/ModernHeader";
import ModernFooter from "./_components/ModernFooter";
import ReduxProvider from "./_provider/ReduxProvider";
import ClientSideToastContainer from "./_components/toast";

export const metadata: Metadata = {
  title: {
    template: "%s / MEGAMART",
    default: "Welcome / MegaMart",
  },
  description: "Luxurious shopping experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const apiOrigin = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_API_URL ?? '').origin;
    } catch {
      return null;
    }
  })();

  return (
    <html lang="en">
      <head>
        {apiOrigin && (
          <>
            <link rel="preconnect" href={apiOrigin} />
            <link rel="dns-prefetch" href={apiOrigin} />
          </>
        )}
      </head>
      <body className="antialiased bg-background font-sans">
        <ReduxProvider>
          <ModernHeader />
          <ClientSideToastContainer />
          <main>{children}</main>
          <ModernFooter />
        </ReduxProvider>
      </body>
    </html>
  );
}
