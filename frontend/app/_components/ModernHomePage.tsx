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
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {electronics?.items
                ?.slice()
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((product, index) => {
                  const themes = [
                    { bg: "from-slate-900 to-slate-700", glow: "bg-blue-400/20", ring: "border-blue-400/20" },
                    { bg: "from-blue-700 to-blue-500",   glow: "bg-cyan-300/20",  ring: "border-cyan-300/20" },
                    { bg: "from-violet-700 to-purple-500", glow: "bg-pink-300/20", ring: "border-pink-300/20" },
                  ];
                  const t = themes[index % themes.length];
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${t.bg} overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}>

                        {/* Decorative background circles */}
                        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

                        {/* Right-side gradient fade so image blends in */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />

                        {/* Text — left side */}
                        <div className="absolute left-5 top-5 bottom-5 flex flex-col justify-between z-10 w-[48%]">
                          <div>
                            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                              {Math.round(product.discountPercentage)}% OFF
                            </span>
                            <p className="text-white font-bold text-sm leading-snug line-clamp-3">
                              {product.title}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs mb-0.5">★ {product.rating.toFixed(1)}</p>
                            <p className="text-white font-semibold text-base">${product.price}</p>
                          </div>
                        </div>

                        {/* Image — right side on a glowing circle platform */}
                        <div className="absolute right-0 top-0 bottom-0 w-[52%] flex items-center justify-center">
                          {/* Glow circle behind image */}
                          <div className={`absolute w-40 h-40 rounded-full ${t.glow} blur-2xl`} />
                          {/* Image container — slightly rotated for dynamism */}
                          <div className={`relative w-36 h-36 rounded-2xl border ${t.ring} bg-white/10 backdrop-blur-sm overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-xl`}>
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              sizes="144px"
                              className="object-contain p-3"
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
