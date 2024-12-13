import { configureStore } from '@reduxjs/toolkit';

import { postApi } from '../app/_services/fetchquerry';
import cartReducer from "../app/_lib/cartSlice"

export const store = configureStore({
  reducer: {

    [postApi.reducerPath]: postApi.reducer,
    cart: cartReducer,

 
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postApi.middleware),
});
