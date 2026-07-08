import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Product } from "../_lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, price, image, rating } = product;

  return (
    <Link href={`/products/${id}`}>
      <Card className="group relative w-full overflow-hidden p-3 hover:shadow-md transition-shadow">
        <div className="relative w-full h-32 sm:h-40 bg-muted/40 rounded-md overflow-hidden">
          <Image
            alt={title}
            src={image}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-contain p-3 group-hover:scale-105 transition-transform"
          />
        </div>
        <h3 className="mt-4 text-sm sm:text-base font-medium text-foreground line-clamp-2 min-h-[40px]">
          {title.length > 30 ? `${title.slice(0, 30)}…` : title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm sm:text-base font-semibold text-primary">
            ${price}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="text-accent">★</span> {rating?.rate ?? "N/A"}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
