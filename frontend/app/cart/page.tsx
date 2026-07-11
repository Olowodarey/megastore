"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../_lib/hooks";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "../_lib/cartSlice";
import { useCreateOrderMutation } from "../_services/authApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const { user, token } = useAppSelector((state) => state.auth);
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const grandTotal = cartItems
    .reduce((total, item) => total + item.totalPrice, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    try {
      const order = await createOrder({
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }).unwrap();

      dispatch(clearCart());
      toast.success("Order placed! Complete payment to confirm.");
      router.push(`/account/orders/${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-3 text-muted-foreground">
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-muted-foreground">
            ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex gap-4 p-4">
                <Link href={`/products/${item.id}`} className="relative w-24 h-24 shrink-0 rounded-lg bg-muted/40 overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-contain p-2 hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.id}`} className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-sm font-bold text-primary whitespace-nowrap shrink-0">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">{item.category}</p>
                  <p className="text-xs text-muted-foreground">${item.price} each</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 rounded-md border border-border p-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-7 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="line-clamp-1 max-w-[160px]">{item.title} ×{item.quantity}</span>
                    <span className="shrink-0">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between font-semibold text-foreground">
                <span>Total</span>
                <span className="text-xl text-primary">${grandTotal}</span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>

              <Button
                type="button"
                size="lg"
                className="w-full mt-6 gap-2"
                onClick={handleCheckout}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    {user ? "Place Order" : "Sign In to Checkout"}
                  </>
                )}
              </Button>

              {!user && (
                <p className="mt-3 text-xs text-center text-muted-foreground">
                  You&apos;ll be redirected to sign in
                </p>
              )}

              <div className="mt-4 text-center text-sm text-muted-foreground">
                or{" "}
                <Link href="/" className="font-medium text-primary hover:text-primary/80">
                  Continue Shopping →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
