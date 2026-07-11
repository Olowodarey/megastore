import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "../app/_services/fetchquerry";
import { authApi } from "../app/_services/authApi";
import cartReducer from "../app/_lib/cartSlice";
import authReducer from "../app/_lib/authSlice";

export const store = configureStore({
  reducer: {
    [postApi.reducerPath]: postApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
