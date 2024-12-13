import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

const CartIcon = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart">
      <div className="relative">
            <ShoppingCartIcon className='h-10 w-10 text-cyan-600' /> 
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
