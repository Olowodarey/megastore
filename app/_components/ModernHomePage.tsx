"use client";

import {
  Smartphone,
  Sparkles,
  Tv,
  Armchair,
  Watch,
  Flower2,
  Headphones,
} from "lucide-react";
import HeroBanner from "./HeroBanner";
import SectionTitle from "./SectionTitle";
import ModernProductCard from "./ModernProductCard";
import CategoryCard from "./CategoryCard";
import { useFetchCategoryProductsQuery } from "../_services/fetchquerry";

const categories = [
  { name: "Mobile", icon: Smartphone, href: "/category/electronics" },
  { name: "Cosmetics", icon: Sparkles, href: "/category/cosmetics" },
  { name: "Electronics", icon: Tv, href: "/category/electronics" },
  { name: "Furniture", icon: Armchair, href: "/category/furniture" },
  { name: "Watches", icon: Watch, href: "/category/watches" },
  { name: "Decor", icon: Flower2, href: "/category/decor" },
  { name: "Accessories", icon: Headphones, href: "/category/accessories" },
];

const ModernHomePage = () => {
  // Fetch products for different sections
  const { data: smartphones, isLoading: loadingSmartphones } =
    useFetchCategoryProductsQuery("electronics");
  const { data: jewelry, isLoading: loadingJewelry } =
    useFetchCategoryProductsQuery("jewelery");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Smartphones Section */}
        <section>
          <SectionTitle
            title="Grab the best deal on Smartphones"
            viewAllLink="/category/electronics"
          />

          {loadingSmartphones ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {smartphones?.slice(0, 5).map((product) => (
                <ModernProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section>
          <SectionTitle
            title="Shop From Top Categories"
            viewAllLink="/categories"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                href={category.href}
              />
            ))}
          </div>
        </section>

        {/* Top Electronics Brands */}
        <section>
          <SectionTitle title="Top Electronics Brands" viewAllLink="/brands" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand Cards with colored backgrounds - You can customize these */}
            <div className="relative h-48 rounded-xl bg-slate-800 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="text-white">
                  <p className="text-3xl font-bold mb-2">📱</p>
                  <p className="text-sm opacity-75">UP to 80% OFF</p>
                </div>
                <div className="text-white text-right">
                  <p className="text-2xl font-bold">Apple</p>
                </div>
              </div>
            </div>

            <div className="relative h-48 rounded-xl bg-yellow-400 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="text-slate-900">
                  <p className="text-3xl font-bold mb-2">📱</p>
                  <p className="text-sm">UP to 60% OFF</p>
                </div>
                <div className="text-slate-900 text-right">
                  <p className="text-2xl font-bold">realme</p>
                </div>
              </div>
            </div>

            <div className="relative h-48 rounded-xl bg-orange-500 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="text-white">
                  <p className="text-3xl font-bold mb-2">📱</p>
                  <p className="text-sm">UP to 80% OFF</p>
                </div>
                <div className="text-white text-right">
                  <p className="text-2xl font-bold">mi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jewelry Section (Daily Essentials style) */}
        <section>
          <SectionTitle
            title="Daily Essentials"
            viewAllLink="/category/jewelery"
          />

          {loadingJewelry ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {jewelry?.slice(0, 6).map((product) => (
                <ModernProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ModernHomePage;
