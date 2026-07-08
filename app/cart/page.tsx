"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../_lib/hooks";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../_lib/cartSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();

  const grandTotal = cartItems
    .reduce((total, item) => total + item.totalPrice, 0)
    .toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-muted-foreground">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 space-y-4">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id}>
                  <Card className="flex gap-4 p-4">
                    <div className="relative w-20 h-20 shrink-0 rounded-md bg-muted/40 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm sm:text-base font-medium text-foreground line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-primary whitespace-nowrap">
                          ${item.price}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground capitalize">
                        {item.category}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-md border border-border p-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              dispatch(decrementQuantity(item.id))
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-8 text-center text-sm text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              dispatch(incrementQuantity(item.id))
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <Card className="p-6 mt-10">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-foreground">
                Subtotal
              </dt>
              <dd className="text-base font-semibold text-primary">
                ${grandTotal}
              </dd>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Shipping and taxes will be calculated at checkout.
            </p>

            <Separator className="my-6" />

            <Button type="button" size="lg" className="w-full">
              Checkout
            </Button>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              or{" "}
              <Link
                href="/"
                className="font-medium text-primary hover:text-primary/80"
              >
                Continue Shopping<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
