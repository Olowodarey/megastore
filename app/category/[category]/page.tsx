"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../_components/productCard";
import { useFetchCategoryProductsQuery } from "../../_services/fetchquerry";

export default function CategoryPage() {
  const { category } = useParams();
  const {
    data: products,
    error,
    isLoading,
  } = useFetchCategoryProductsQuery(category as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Loading {category} products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">
          Error loading {category} products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-5 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">
          {category} Collection
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
