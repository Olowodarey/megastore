import { Josefin_Sans } from "next/font/google";
import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import ModernHeader from "./_components/ModernHeader";
import ModernFooter from "./_components/ModernFooter";
import ReduxProvider from "./_provider/ReduxProvider";
import { ThemeProvider } from "./_provider/ThemeProvider";
import ClientSideToastContainer from "./_components/toast";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s / MEGAMART",
    default: "welcome / MegaMart",
  },
  description: "luxurious shopping experience",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${josefin.className} antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <ModernHeader />
            <ClientSideToastContainer />
            <main>{children}</main>
            <ModernFooter />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
