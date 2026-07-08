"use client";

import Link from "next/link";
import Logo from "./Logo";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/solid";
import CartIcon from "./cartIcon";

const Navbar = () => {
  return (
    <div className="mt-5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
      <Link href="/#">
        <Logo />
      </Link>

      <div className="flex lg:space-x-4 justify-between items-center">
        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-600" />
          <input
            type="text"
            placeholder="Search essentials, groceries and more"
            className="pl-10 pr-4 py-0 lg:py-2 w-full lg:w-[500px] border bg-cyan-50 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="hidden lg:flex flex-col space-y-4 mt-4 lg:mt-0 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
          <p className="flex items-center">
            <UserIcon className="h-7 w-7 text-cyan-600" />
            <span>Sign in/Sign up</span>
          </p>
          <p>|</p>

          <div className="flex items-center">
            <CartIcon />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="flex space-x-3 lg:hidden">
          <p className="flex items-center">
            <UserIcon className="h-5 w-5 text-cyan-600" />
            <span></span>
          </p>

          <div className="flex space-x-1 items-center">
            <CartIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
