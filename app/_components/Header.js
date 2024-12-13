import { MapPinIcon, TruckIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

const Header = () => {
  return (
    <div className="bg-gray-300">
      <main className="max-w-7xl mx-auto w-full p-1">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="text-sm lg:text-base ">
            Welcome to worldwide MegaMart!
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-4 items-center">
            <p className="flex items-center text-sm lg:text-base ">
              <MapPinIcon className="h-5 w-5 text-cyan-600 " />
              <span>Deliver to 423333</span>
            </p>
            <p className="hidden lg:flex items-center space-x-1">
              <span>|</span>
              <TruckIcon className="h-5 w-5  text-cyan-600 " />
              <span>Track your order</span>
            </p>
            <p className="hidden lg:flex items-center space-x-1">
              <span>|</span>
              <CheckBadgeIcon className="h-5 w-5  text-cyan-600 " />
              <span>All Offers</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Header;
