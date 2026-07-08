import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../_lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, price, image, rating } = product;

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative w-full sm:w-[180px] border-2 p-2 rounded-md">
        <div className="flex justify-center h-[120px] sm:h-[100px] w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-32 xl:h-40">
          <div className="relative w-full h-full">
            <Image
              alt={title}
              src={image}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover"
            />
          </div>
        </div>
        <h3 className="mt-4 text-sm sm:text-lg text-gray-700">
          {title.length > 20 ? `${title.slice(0, 10)}...` : title}
        </h3>
        <div className="mt-6 flex justify-between">
          <p className="mt-1 text-xs sm:text-sm font-medium text-gray-900">
            ${price}
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-yellow-500">
            Rating: {rating?.rate || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
