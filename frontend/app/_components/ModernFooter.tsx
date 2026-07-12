"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const AUTH_PAGES = ["/login", "/register"];

const categories = [
  { name: "Smartphones", href: "/category/Smartphones" },
  { name: "Electronics", href: "/category/Electronics" },
  { name: "Furniture", href: "/category/Furniture" },
  { name: "Shoes", href: "/category/Shoes" },
  { name: "Miscellaneous", href: "/category/Miscellaneous" },
];

const customerServices = [
  { name: "About Us", href: "/about" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "FAQ", href: "/faq" },
  { name: "Cancellation & Returns", href: "/returns" },
  { name: "Track My Order", href: "/account/orders" },
];

const socials = [
  { letter: "f", href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { letter: "𝕏", href: "#", label: "Twitter", color: "hover:bg-slate-600" },
  { letter: "in", href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { letter: "▶", href: "#", label: "YouTube", color: "hover:bg-red-600" },
];

const ModernFooter = () => {
  const pathname = usePathname();

  if (AUTH_PAGES.includes(pathname)) {
    return (
      <footer className="bg-[#0f172a] text-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MegaMart. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-16">
      {/* Newsletter strip */}
      <div className="border-b border-white/10 bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-lg">Stay in the loop</p>
            <p className="text-slate-400 text-sm">Get the latest deals delivered to your inbox.</p>
          </div>
          <div className="flex w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-l-lg bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-r-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                Mega<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your one-stop destination for the best deals on electronics, fashion, furniture and more — delivered worldwide.
            </p>

            {/* Contact */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a href="tel:08142293610" className="hover:text-white transition-colors">
                  08142293610
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-slate-400">support@megamart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-slate-400">Worldwide Delivery Available</span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Shop Categories
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-3 mt-4">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Customer Service
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-3 mt-4">
              {customerServices.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App + Socials */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative">
              Download App
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <div className="flex flex-col gap-3 mt-4">
              {/* Google Play — trademark gradient icon */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none">
                  <path d="M3.18 1.42C2.8 1.7 2.5 2.18 2.5 2.82v18.36c0 .64.3 1.12.68 1.4l.08.06 10.28-10.28v-.24L3.26 1.36l-.08.06z" fill="url(#gp1)"/>
                  <path d="M16.98 15.78l-3.44-3.44v-.24l3.44-3.44.08.04 4.08 2.32c1.16.66 1.16 1.74 0 2.4l-4.08 2.32-.08.04z" fill="url(#gp2)"/>
                  <path d="M17.06 15.74L13.54 12.1 3.18 22.58c.38.4.98.44 1.66.06l12.22-6.9" fill="url(#gp3)"/>
                  <path d="M17.06 8.26L4.84 1.36C4.16.98 3.56 1.02 3.18 1.42l10.36 10.64 3.52-3.8z" fill="url(#gp4)"/>
                  <defs>
                    <linearGradient id="gp1" x1="14.7" y1="2.9" x2="-1.1" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00A0FF"/>
                      <stop offset="1" stopColor="#00F0FF"/>
                    </linearGradient>
                    <linearGradient id="gp2" x1="21.8" y1="12" x2="2.1" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFD900"/>
                      <stop offset="1" stopColor="#FF8C00"/>
                    </linearGradient>
                    <linearGradient id="gp3" x1="15.8" y1="13.9" x2="-1.5" y2="27.8" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF3A44"/>
                      <stop offset="1" stopColor="#C31162"/>
                    </linearGradient>
                    <linearGradient id="gp4" x1="0" y1="-1.2" x2="13" y2="10.2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#32A071"/>
                      <stop offset="1" stopColor="#2DA771"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <p className="text-xs text-slate-400">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>

              {/* App Store — Apple trademark black + white */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black hover:bg-[#1a1a1a] border border-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-xs text-slate-400">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>
            </div>

            {/* Socials */}
            <div className="mt-6">
              <p className="text-white text-sm font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socials.map(({ letter, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-9 h-9 rounded-full bg-white/10 ${color} text-white flex items-center justify-center text-xs font-bold transition-all`}
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MegaMart. All rights reserved.</p>
          <p>
            Designed & Built by{" "}
            <span className="text-primary font-semibold">Darey Olowo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
