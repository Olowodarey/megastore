"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../_lib/cartSlice";
import { Product } from "../_lib/types";
import { useAppDispatch } from "../_lib/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { title, price, description, image, rating } = product;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const totalPrice = (price * quantity).toFixed(2);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image */}
          <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted/40 flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={400}
              height={400}
              className="object-contain p-6"
            />
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            <p className="mt-6 text-3xl font-semibold text-primary">${price}</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              <span className="text-accent">★</span> Rating:{" "}
              {rating?.rate ?? "N/A"}
            </p>

            <Separator className="my-6" />

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                Quantity
              </span>
              <div className="inline-flex items-center gap-1 rounded-md border border-border p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-8 text-center text-foreground">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 text-lg font-medium text-foreground">
              Total:{" "}
              <span className="font-semibold text-primary">${totalPrice}</span>
            </p>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
