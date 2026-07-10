"use client";

import Image from "next/image";
import Link from "next/link";
import { Smartphone, Tv, Armchair, Footprints, Package } from "lucide-react";
import HeroBanner from "./HeroBanner";
import SectionTitle from "./SectionTitle";
import ModernProductCard from "./ModernProductCard";
import CategoryCard from "./CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchCategoryProductsQuery } from "../_services/fetchquerry";

const categories = [
  { name: "Smartphones", icon: Smartphone, href: "/category/Smartphones" },
  { name: "Electronics", icon: Tv, href: "/category/Electronics" },
  { name: "Furniture", icon: Armchair, href: "/category/Furniture" },
  { name: "Shoes", icon: Footprints, href: "/category/Shoes" },
  { name: "Miscellaneous", icon: Package, href: "/category/Miscellaneous" },
];

const ModernHomePage = () => {
  // Fetch products for different sections
  const { data: smartphones, isLoading: loadingSmartphones } =
    useFetchCategoryProductsQuery("Smartphones");
  const { data: electronics, isLoading: loadingElectronics } =
    useFetchCategoryProductsQuery("Electronics");
  const { data: shoes, isLoading: loadingShoes } =
    useFetchCategoryProductsQuery("Shoes");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Smartphones Section */}
        <section>
          <SectionTitle
            title="Grab the best deal on Electronics"
            viewAllLink="/category/Electronics"
          />

          {loadingSmartphones ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {smartphones?.items?.slice(0, 5).map((product) => (
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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

        {/* Featured Electronics */}
        <section>
          <SectionTitle
            title="Featured Electronics"
            viewAllLink="/category/Electronics"
          />

          {loadingElectronics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {electronics?.items
                ?.slice()
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((product, index) => {
                  const bgColors = [
                    "bg-slate-800",
                    "bg-blue-600",
                    "bg-violet-600",
                  ];
                  const textColors = ["text-white", "text-white", "text-white"];
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div
                        className={`relative h-48 rounded-xl ${bgColors[index]} overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        <div className="absolute inset-0 flex items-center justify-between px-8">
                          <div className={textColors[index]}>
                            <p className="text-sm opacity-75 mb-1">
                              {Math.round(product.discountPercentage)}% OFF
                            </p>
                            <p className="text-base font-semibold w-36 line-clamp-2 leading-tight">
                              {product.title}
                            </p>
                            <p className="text-xs mt-2 opacity-75">
                              ★ {product.rating.toFixed(1)}
                            </p>
                          </div>
                          <div className="relative w-28 h-36 shrink-0">
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              sizes="112px"
                              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </section>

        {/* Shoes Section */}
        <section>
          <SectionTitle
            title="Top Footwear Picks"
            viewAllLink="/category/Shoes"
          />

          {loadingShoes ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shoes?.items?.slice(0, 6).map((product) => (
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
