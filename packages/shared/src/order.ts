import type { Product } from "./product";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
