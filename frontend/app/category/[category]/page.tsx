"use client";

import React from "react";
import { useParams } from "next/navigation";
import ModernProductCard from "../../_components/ModernProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchCategoryProductsQuery } from "../../_services/fetchquerry";

export default function CategoryPage() {
  const { category } = useParams();
  const {
    data: products,
    error,
    isLoading,
  } = useFetchCategoryProductsQuery(category as string);

  const total = products?.total ?? 0;

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-32 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg font-semibold text-destructive">
          Error loading {String(category)} products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
          {String(category)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground mb-8">
          {total} {total === 1 ? "product" : "products"} found
        </p>

        {total === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products?.items?.map((product) => (
              <ModernProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
