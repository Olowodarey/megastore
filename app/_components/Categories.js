'use client';

import React from 'react';
import Link from 'next/link';
import { useFetchCategoriesQuery } from '../_services/fetchquerry';

export default function Categories() {
  const { data: categories, error, isLoading } = useFetchCategoriesQuery();

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Shop from Top Categories
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
          {categories.map((category) => (
            <div key={category} className="group relative  block text-center px-4 py-2 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition-all capitalize">
              <Link href={`/category/${category}`} passHref>
              
                  {category}
                
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
