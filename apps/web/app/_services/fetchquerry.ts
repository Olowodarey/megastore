import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../_lib/types";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/products" }),
  endpoints: (builder) => ({
    fetchCategories: builder.query<string[], void>({
      query: () => "categories",
    }),
    fetchCategoryProducts: builder.query<Product[], string>({
      query: (category) => `category/${category}`,
    }),
    fetchProductById: builder.query<Product, string | number>({
      query: (id) => `${id}`,
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useFetchCategoryProductsQuery,
  useFetchProductByIdQuery,
} = postApi;
