import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "../_lib/types";

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product }) => {
  const { id, title, price, image, rating } = product;

  // Calculate discount percentage (mock - you can calculate based on your data)
  const discount = 32; // This would come from your product data
  const originalPrice = (price * 1.5).toFixed(2); // Mock original price

  return (
    <Link href={`/products/${id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50">
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground font-semibold"
          >
            {discount}% OFF
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative w-full h-48 bg-muted/30 overflow-hidden">
          <Image
            alt={title}
            src={image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3
            className="text-sm font-medium line-clamp-2 mb-3 min-h-[40px]"
            style={{ color: "#222222" }}
          >
            {title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-green-600">${price}</span>
            {discount > 0 && (
              <span
                className="text-sm line-through"
                style={{ color: "#666666" }}
              >
                ${originalPrice}
              </span>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span style={{ color: "#666666" }}>
                {rating.rate} ({rating.count})
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ModernProductCard;
