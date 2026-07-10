"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../_components/productCard";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-lg font-semibold text-destructive">
          Error loading {String(category)} products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-5 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
          {String(category)} Collection
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
          {products?.items?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
