import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, CartItem, Product } from "./types";

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const serializedCart = localStorage.getItem("cartItems");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (err) {
    console.error("Error loading cart from local storage", err);
    return [];
  }
};

const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  if (typeof window === "undefined") return;

  try {
    const serializedCart = JSON.stringify(cartItems);
    localStorage.setItem("cartItems", serializedCart);
  } catch (err) {
    console.error("Error saving cart to local storage", err);
  }
};

const initialState: CartState = {
  cartItems: [],
};

interface AddToCartPayload extends Product {
  quantity: number;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice +=
          action.payload.price * action.payload.quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          totalPrice: action.payload.price * action.payload.quantity,
        });
      }
      saveCartToLocalStorage(state.cartItems);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        item.totalPrice += item.price;
        saveCartToLocalStorage(state.cartItems);
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice -= item.price;
        saveCartToLocalStorage(state.cartItems);
      }
    },
    initializeCart: (state) => {
      state.cartItems = loadCartFromLocalStorage();
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
