"use client";

import { useState } from "react";
import Image from "next/image";
import { addToCart } from "../_lib/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Product } from "../_lib/types";
import { useAppDispatch } from "../_lib/hooks";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { title, price, description, image, rating } = product;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={400}
              height={400}
              className="object-cover"
            />
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-4 text-lg text-gray-700">{description}</p>
            <p className="mt-6 text-2xl font-medium text-gray-900">${price}</p>
            <p className="mt-2 text-sm font-medium text-yellow-500">
              Rating: {rating?.rate || "N/A"}
            </p>

            {/* Quantity Controls */}
            <div className="mt-4 flex items-center space-x-5">
              <button
                className="px-3 py-1 bg-red-400 rounded-md"
                onClick={handleDecrement}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="px-2 py-1 bg-green-400 rounded-md"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">
              Total: ${totalPrice}
            </p>

            {/* Add to Cart Button */}
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
