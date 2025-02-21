import React from "react";
import { Dot } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="hidden items-center justify-between bg-[#F5F7FA] px-9 py-4 dark:bg-slate-400 md:flex">
      <div>
        <Link
          href="https://www.brotecs.com/"
          className="text-sm font-normal leading-5 text-basicColor md:text-xs"
          target="_blank"
        >
          <span className="text-[15px] text-primary-500 dark:text-white">
            {" "}
            © {new Date().getFullYear()} -Bro Tecs
          </span>
        </Link>
      </div>
      <div className="">
        <Link
          href="https://www.brotecs.com/"
          className="text-sm font-normal leading-5 text-basicColor md:text-xs"
          target="_blank"
        >
          {" "}
          <span className="text-[15px] text-primary-500 dark:text-white">
            Powered By:- Brotecs Technologies.
          </span>
        </Link>
      </div>
      <div className="flex items-center text-sm font-normal leading-5 md:text-xs">
        <Link
          target="_blank"
          href="https://www.brotecs.com/privacy-policy/"
          className="text-[15px] dark:text-white"
        >
          Privacy Policy
        </Link>
        <Dot className="" />
        <Link
          target="_blank"
          href="https://www.brotecs.com/terms-of-use/"
          className="text-[15px] dark:text-white"
        >
          FAQs
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
