"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetchCategoryProductsQuery } from "../_services/fetchquerry";

const THEMES = [
  {
    bg: "from-[#0f172a] via-[#1e3a5f] to-[#0f172a]",
    glow: "bg-blue-500/20",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    bg: "from-[#0f1f0f] via-[#1a3a1a] to-[#0f1f0f]",
    glow: "bg-emerald-500/20",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    bg: "from-[#1a0f2e] via-[#2d1b69] to-[#1a0f2e]",
    glow: "bg-violet-500/20",
    accent: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    bg: "from-[#1f0f0f] via-[#3a1a1a] to-[#1f0f0f]",
    glow: "bg-rose-500/20",
    accent: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    bg: "from-[#0f1a2e] via-[#1a2f4a] to-[#0f1a2e]",
    glow: "bg-cyan-500/20",
    accent: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [fading, setFading] = useState(false);

  const { data: smartphones } = useFetchCategoryProductsQuery("Smartphones");
  const { data: electronics } = useFetchCategoryProductsQuery("Electronics");

  const bannerProducts = [
    ...(smartphones?.items ?? []),
    ...(electronics?.items ?? []),
  ]
    .filter((p) => p.thumbnail?.startsWith("http"))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const goTo = (index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setFading(false);
    }, 200);
  };

  useEffect(() => {
    if (!autoPlay || bannerProducts.length === 0) return;
    const timer = setInterval(() => {
      goTo((currentSlide + 1) % bannerProducts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoPlay, currentSlide, bannerProducts.length]);

  const prev = () => {
    setAutoPlay(false);
    goTo((currentSlide - 1 + bannerProducts.length) % bannerProducts.length);
  };

  const next = () => {
    setAutoPlay(false);
    goTo((currentSlide + 1) % bannerProducts.length);
  };

  if (bannerProducts.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="h-[320px] md:h-[420px] rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
      </div>
    );
  }

  const product = bannerProducts[currentSlide];
  const theme = THEMES[currentSlide % THEMES.length];
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden">

        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} transition-all duration-500`} />

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        {/* Content */}
        <div
          className={`relative h-full flex items-center justify-between px-8 md:px-16 transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {/* Left — text */}
          <div className="text-white z-10 max-w-xs md:max-w-md">
            <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${theme.badge} mb-4`}>
              {product.category}
            </span>

            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3 line-clamp-2">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className={`text-3xl font-bold ${theme.accent}`}>
                ${product.price}
              </span>
              <span className="text-base line-through text-white/40">
                ${originalPrice}
              </span>
              <Badge className="bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-400">
                {Math.round(product.discountPercentage)}% OFF
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 font-bold px-8"
              >
                <Link href={`/products/${product.id}`}>Shop Now →</Link>
              </Button>
              <span className="text-white/50 text-sm">★ {product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Right — product image with glow */}
          <div className="hidden md:flex items-center justify-center relative w-72 h-72 lg:w-80 lg:h-80 shrink-0">
            {/* Glow blob behind image */}
            <div className={`absolute inset-8 rounded-full ${theme.glow} blur-2xl`} />
            <div className="relative w-full h-full">
              <Image
                key={product.id}
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="320px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 items-center">
          {bannerProducts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setAutoPlay(false); goTo(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-white w-6 h-2"
                  : "bg-white/30 hover:bg-white/50 w-2 h-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
