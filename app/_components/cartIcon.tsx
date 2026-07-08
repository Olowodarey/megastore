"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "../_lib/hooks";
import { Button } from "@/components/ui/button";

const CartIcon = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" aria-label={`Cart, ${itemCount} items`}>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5 text-primary" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-semibold">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartIcon;
