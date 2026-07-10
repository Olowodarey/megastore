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
  return (
    <html lang="en">
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
