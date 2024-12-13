'use client';

import React from 'react';
import ProductCard from './productCard';
import Link from 'next/link';
import { useFetchCategoryProductsQuery } from '../_services/fetchquerry.jsx';

export default function Cloths() {
  const category = "women's clothing "; 
  const { data: products, error, isLoading } = useFetchCategoryProductsQuery(category);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading Jewelry Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">
          Error loading products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            check out women clothings 
          </h2>
          <Link
            href={`/category/${category}`}
            className="hidden text-sm font-bold text-indigo-600 hover:text-indigo-500 md:block"
          >
            SEE MORE<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-sm md:hidden flex justify-center">
        <Link
            href={`/category/${category}`}
            className="font-bold text-indigo-600 hover:text-indigo-500"
          >
            SEE MORE <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
