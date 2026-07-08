import { Josefin_Sans } from "next/font/google";
import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import ReduxProvider from "./_provider/ReduxProvider";
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
    <html lang="en">
      <ReduxProvider>
        <body className={`${josefin.className} antialiased`}>
          <Header />

          <div className="px-5 lg:px-10">
            <main className="max-w-7xl mx-auto ">
              <ClientSideToastContainer />
              <Navbar />
              {children}
            </main>
          </div>

          <Footer />
        </body>
      </ReduxProvider>
    </html>
  );
}
