import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../redux/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface OrderItem {
  id: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    category?: string;
  };
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, { email: string; password: string; name?: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
    }),
    createOrder: builder.mutation<Order, { items: { productId: number; quantity: number }[] }>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
} = authApi;
