"use client";
import { CheckIcon, ClockIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../_lib/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const grandTotal = cartItems
    .reduce((total, item) => total + item.totalPrice, 0)
    .toFixed(2);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex  items-center justify-between">
                        <h4 className="text-sm">
                          <p className="font-medium text-sm sm:text-lg text-gray-700 hover:text-gray-800">
                            {item.title}
                          </p>
                        </h4>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          ${item.price}
                        </p>
                      </div>
                      <p className="mt-1 text-base text-gray-500">
                        Type {item.category}
                      </p>
                    </div>


                    <div>
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                             className="px-3 py-1 bg-red-400 rounded-md"
                            onClick={() => handleDecrement(item.id)}
                          >
                            -
                          </button>
                          <p className="text-sm text-gray-700">
                            {item.quantity}
                          </p>
                          <button
                          className="px-2 py-1 bg-green-400 rounded-md"
                            onClick={() => handleIncrement(item.id)}
                          >
                            +
                          </button>

                        
                        </div>

                        <div className=" ">
                            <button
                              className="px-4 py-2 bg-red-600 text-white rounded-md"
                              onClick={() => handleRemove(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                      </div>
                    </div>

          
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-10">
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Subtotal
                  </dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    ${grandTotal}
                  </dd>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                or{" "}
                <Link
                  href={"/#"}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Cart;
