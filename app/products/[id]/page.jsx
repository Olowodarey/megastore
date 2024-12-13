'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '../../_components/productDetail';
import { useFetchProductByIdQuery } from '../../_services/fetchquerry.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, error, isLoading } = useFetchProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">
          Error loading product. Please try again later.
        </p>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
