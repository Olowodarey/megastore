"use client";

import Link from "next/link";
import { Search, User, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartIcon from "./cartIcon";
import { ThemeToggle } from "./ThemeToggle";

const ModernHeader = () => {
  return (
    <header className="w-full border-b bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <p className="text-muted-foreground">
              Welcome to worldwide Megamart!
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Deliver to 423333</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Track your order</span>
              </div>
              <div className="hidden md:block text-muted-foreground">
                All Offers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary">MegaMart</div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search essentials, groceries and more..."
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-md bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />

              {/* Sign In */}
              <Button
                variant="ghost"
                className="hidden lg:flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                <span>Sign In / Sign Up</span>
              </Button>

              {/* Mobile User Icon */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <User className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <div className="relative">
                <CartIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 py-3 overflow-x-auto">
            <Button variant="default" size="sm" className="whitespace-nowrap">
              All Category
            </Button>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Track Order
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              All Deals
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Today&apos;s Deals
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Customer Service
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Gift Cards
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Sell
            </Link>
            <Link
              href="/category/electronics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Registry
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden bg-background border-t px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
