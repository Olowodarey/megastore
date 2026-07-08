import Image from "next/image";
import logo from "../public/logo.png";
import MegaMart from "../public/MegaMart.png";

const Logo = () => {
  return (
    <div className="flex items-center space-x-4">
      <div>
        <Image src={logo} height={50} quality={100} width={60} alt="logo" />
      </div>

      <div>
        <Image
          src={MegaMart}
          height={90}
          quality={100}
          width={100}
          alt="meaga"
        />
      </div>
    </div>
  );
};

export default Logo;
