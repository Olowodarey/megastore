"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, MapPin, Phone, Package, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CartIcon from "./cartIcon";
import { useAppDispatch, useAppSelector } from "../_lib/hooks";
import { logout } from "../_lib/authSlice";

const ModernHeader = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="w-full border-b bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-[#F5EEDD] dark:bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <p className="text-muted-foreground">Welcome to worldwide Megamart!</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Worldwide Delivery</span>
              </div>
              <Link href="/account/orders" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <span>Track your order</span>
              </Link>
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

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-16 py-2.5 border border-input rounded-md bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                /* Logged-in user dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {(user.name ?? user.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name ?? user.email}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {/* Mobile icon */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="lg:hidden w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold"
                  >
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name ?? "Account"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        My Orders
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors border-t border-border"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest */
                <>
                  <Button asChild variant="ghost" className="hidden lg:flex items-center gap-2">
                    <Link href="/login">
                      <User className="h-5 w-5" />
                      <span>Sign In / Sign Up</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="lg:hidden">
                    <Link href="/login"><User className="h-5 w-5" /></Link>
                  </Button>
                </>
              )}

              <div className="relative">
                <CartIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#DFF0DE] dark:bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 py-3 overflow-x-auto">
            <Button variant="default" size="sm" className="whitespace-nowrap">All Category</Button>
            <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Track Order</Link>
            <Link href="/category/Electronics" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Electronics</Link>
            <Link href="/category/Smartphones" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Smartphones</Link>
            <Link href="/category/Furniture" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Furniture</Link>
            <Link href="/category/Shoes" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Shoes</Link>
            <Link href="/category/Miscellaneous" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Miscellaneous</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      <form onSubmit={handleSearch} className="md:hidden bg-background border-t px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>
    </header>
  );
};

export default ModernHeader;
