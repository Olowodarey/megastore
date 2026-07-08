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

  const discount = 32;
  const originalPrice = (price * 1.5).toFixed(2);

  return (
    <Link href={`/products/${id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50">
        {discount > 0 && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3 z-10 font-semibold"
          >
            {discount}% OFF
          </Badge>
        )}

        <div className="relative w-full h-48 bg-muted/40 overflow-hidden">
          <Image
            alt={title}
            src={image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 min-h-[40px]">
            {title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-primary">${price}</span>
            {discount > 0 && (
              <span className="text-sm line-through text-muted-foreground">
                ${originalPrice}
              </span>
            )}
          </div>

          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-accent">★</span>
              <span className="text-muted-foreground">
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
