"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "../_lib/hooks";

const CartIcon = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart">
      <div className="relative">
        <ShoppingCartIcon className="h-10 w-10 text-cyan-600" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
