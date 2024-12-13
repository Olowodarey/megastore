import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com/products' }),
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => 'categories',
    }),
    fetchCategoryProducts: builder.query({
      query: (category) => `category/${category}`,
    }),
    fetchProductById: builder.query({
      query: (id) => `${id}`,
    }),
  }),
});

export const { useFetchCategoriesQuery, useFetchCategoryProductsQuery, useFetchProductByIdQuery } = postApi;
