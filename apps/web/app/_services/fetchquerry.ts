import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PaginatedProducts, Product } from "../_lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    fetchCategories: builder.query<string[], void>({
      query: () => "/products/categories",
    }),
    fetchCategoryProducts: builder.query<PaginatedProducts, string>({
      query: (category) => `/products/category/${category}`,
    }),
    fetchProductById: builder.query<Product, string | number>({
      query: (id) => `/products/${id}`,
    }),
    fetchAllProducts: builder.query<PaginatedProducts, void>({
      query: () => "/products",
    }),
    searchProducts: builder.query<PaginatedProducts, string>({
      query: (q) => `/products?search=${encodeURIComponent(q)}&pageSize=20`,
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useFetchCategoryProductsQuery,
  useFetchProductByIdQuery,
  useFetchAllProductsQuery,
  useSearchProductsQuery,
} = postApi;
