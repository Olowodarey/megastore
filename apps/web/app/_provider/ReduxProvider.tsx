"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../../redux/store";
import { initializeAuth } from "../_lib/authSlice";
import { initializeCart } from "../_lib/cartSlice";
import { ReactNode } from "react";
import type { AppDispatch } from "../../redux/store";

function Initializer() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeCart());
  }, [dispatch]);
  return null;
}

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <Initializer />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
