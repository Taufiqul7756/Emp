import React from "react";
import { Dot } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="hidden items-center justify-between bg-[#F5F7FA] px-9 py-4 md:flex">
      <div>
        <Link
          href="https://ambufast.com"
          className="text-sm font-normal leading-5 text-basicColor md:text-xs"
          target="_blank"
        >
          <span className="text-[15px] text-primary-500">
            {" "}
            © {new Date().getFullYear()} - AmbuFast
          </span>
        </Link>
      </div>
      <div className="">
        <Link
          href="https://techanalyticaltd.com/"
          className="text-sm font-normal leading-5 text-basicColor md:text-xs"
          target="_blank"
        >
          {" "}
          <span className="text-[15px] text-primary-500">
            Powered By:- Tech Analytica Limited.
          </span>
        </Link>
      </div>
      <div className="flex items-center text-sm font-normal leading-5 md:text-xs">
        <Link
          target="_blank"
          href="https://ambufast.com/privacy-policy"
          className="text-[15px]"
        >
          Privacy Policy
        </Link>
        <Dot className="" />
        <Link
          target="_blank"
          href="https://ambufast.com/about"
          className="text-[15px]"
        >
          FAQs
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
