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
        <BreadcrumbItem key={item.href}>
          {item.isLast ||
          item.label === "Member Management" ||
          item.label === "Service Management" ||
          item.label === "Ads Management" ? (
            <BreadcrumbPage
              className={
                item.label === ""
                  ? "font-bold text-black"
                  : "font-bold text-primary-500"
              }
            >
              {item.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={item.href}>{item.label}</Link>
            </BreadcrumbLink>
          )}
          {!item.isLast && (
            <CgFormatSlash className="mx-2 h-4 w-4 text-muted-foreground" />
          )}
        </BreadcrumbItem>
      ))}
    </BreadcrumbRoot>
  );
};
