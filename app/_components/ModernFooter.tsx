import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ModernFooter = () => {
  const popularCategories = [
    { name: "Fashion", href: "/category/fashion" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Cosmetics", href: "/category/cosmetics" },
    { name: "Health & Beauty", href: "/category/health" },
    { name: "Watches", href: "/category/watches" },
    { name: "Kids Fashion", href: "/category/kids" },
    { name: "Mobiles", href: "/category/mobiles" },
    { name: "Dairy & Bakery", href: "/category/dairy" },
  ];

  const customerServices = [
    { name: "About Us", href: "/about" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "E-waste Policy", href: "/ewaste" },
    { name: "Cancellation & Return Policy", href: "/returns" },
  ];

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">MegaMart</h3>
            <div className="space-y-3">
              <p className="text-sm opacity-90">Contact Us</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Whatsapp: +1 202-918-2132</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Call Us: +1 202-918-2132</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm mb-3">Download App</p>
              <div className="flex gap-2">
                <div className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-md cursor-pointer">
                  <p className="text-xs">Get it on</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
                <div className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-md cursor-pointer">
                  <p className="text-xs">Download on the</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </div>
            </div>
          </div>

          {/* Most Popular Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Most Popular Categories
            </h4>
            <ul className="space-y-2">
              {popularCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm opacity-90 hover:opacity-100 transition-opacity hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Services</h4>
            <ul className="space-y-2">
              {customerServices.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm opacity-90 hover:opacity-100 transition-opacity hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/20 text-center">
          <p className="text-sm opacity-75">
            © 2024 All rights reserved. Reliance Retail Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
