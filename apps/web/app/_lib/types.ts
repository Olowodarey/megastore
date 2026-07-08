// Product types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Cart item types
export interface CartItem extends Product {
  quantity: number;
  totalPrice: number;
}

// Cart state type
export interface CartState {
  cartItems: CartItem[];
}

// Redux store type
export interface RootState {
  cart: CartState;
  postApi: any;
}
