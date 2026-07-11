"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../_lib/cartSlice";
import { Product } from "../_lib/types";
import { useAppDispatch } from "../_lib/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { title, price, description, thumbnail, images, rating, discountPercentage, stock, brand, category } = product;

  const allImages = images?.length ? images : [thumbnail];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const originalPrice = (price / (1 - discountPercentage / 100)).toFixed(2);

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

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-10 lg:items-start">

          {/* ── Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative w-full h-96 rounded-2xl bg-muted/40 overflow-hidden border border-border">
              <Image
                key={selectedImage}
                src={selectedImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
              {discountPercentage > 0 && (
                <Badge variant="accent" className="absolute top-4 left-4 text-sm font-semibold">
                  {Math.round(discountPercentage)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-muted/40 transition-all ${
                      selectedImage === img
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} image ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="mt-10 lg:mt-0 flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground capitalize">{category}</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">
                {title}
              </h1>
              {brand && (
                <p className="mt-1 text-sm text-muted-foreground">by <span className="font-medium text-foreground">{brand}</span></p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-accent text-lg">★</span>
              <span className="font-medium text-foreground">{rating?.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">· {stock} in stock</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">${price}</span>
              {discountPercentage > 0 && (
                <span className="text-lg line-through text-muted-foreground">${originalPrice}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{description}</p>

            <Separator />

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="inline-flex items-center gap-1 rounded-md border border-border p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  aria-label="Decrease quantity"
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-8 text-center text-foreground font-medium">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">${(price * quantity).toFixed(2)}</span>
              </span>
            </div>

            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
