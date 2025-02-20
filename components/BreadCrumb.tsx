"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgFormatSlash } from "react-icons/cg";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { IoIosArrowForward } from "react-icons/io";

interface BreadcrumbProps {
  className?: string;
}

export const Breadcrumb = ({ className = "" }: BreadcrumbProps) => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter((segment) => segment);

    return segments.map((segment, index) => ({
      href: "/" + segments.slice(0, index + 1).join("/"),
      label: segment
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      isLast: index === segments.length - 1,
    }));
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <BreadcrumbRoot className={className}>
      {breadcrumbs.map((item, index) => (
        <BreadcrumbItem className="text-lg" key={item.href}>
          {item.isLast ? (
            <BreadcrumbPage className="font-bold text-primary-500">
              {item.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link className=" font-bold " href={item.href}>
                {item.label}
              </Link>
            </BreadcrumbLink>
          )}
          {!item.isLast && <IoIosArrowForward className="mx-2 h-4 w-4  " />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbRoot>
  );
};
