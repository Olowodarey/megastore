"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductDetail from "../../_components/productDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchProductByIdQuery } from "../../_services/fetchquerry";

export default function ProductPage() {
  const { id } = useParams();
  const {
    data: product,
    error,
    isLoading,
  } = useFetchProductByIdQuery(id as string);

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="mt-10 lg:mt-0 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-lg font-semibold text-destructive">
          Error loading product. Please try again later.
        </p>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
