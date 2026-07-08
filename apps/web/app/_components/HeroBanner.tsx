"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "SMART WEARABLE.",
    subtitle: "Best Deal Online on smart watches",
    discount: "UP to 80% OFF",
    image: "/banner-1.jpg", // You'll need to add actual images
    bgColor: "bg-gradient-to-r from-slate-800 to-slate-700",
  },
  {
    id: 2,
    title: "TRENDING PHONES",
    subtitle: "Grab the latest smartphones",
    discount: "UP to 70% OFF",
    image: "/banner-2.jpg",
    bgColor: "bg-gradient-to-r from-blue-800 to-blue-700",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
        {/* Banner Content */}
        <div
          className={`${banners[currentSlide].bgColor} h-full flex items-center justify-between px-8 md:px-12`}
        >
          {/* Text Content */}
          <div className="text-white z-10 max-w-md">
            <p className="text-sm md:text-base mb-2">
              {banners[currentSlide].subtitle}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {banners[currentSlide].title}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-6">
              {banners[currentSlide].discount}
            </p>
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100"
            >
              Shop Now →
            </Button>
          </div>

          {/* Image/Product (Placeholder) */}
          <div className="hidden md:block relative w-1/3 h-full">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              {/* Add your product image here */}
              <div className="w-64 h-64 bg-slate-600 rounded-3xl opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
