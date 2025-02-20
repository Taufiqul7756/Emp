"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import { motion } from "framer-motion";

interface NavLink {
  title: string;
  label?: string;
  icon: IconType;
  variant: "default" | "ghost";
  href: string;
  subLinks?: NavLink[];
}

interface NavProps {
  isCollapsed: boolean;
  links: NavLink[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    // Check if any link or subLink is active based on the current pathname
    const findActiveLink = (links: NavLink[]): string | null => {
      for (const link of links) {
        if (link.href === pathname) return link.title;
        if (link.subLinks) {
          const activeSubLink = findActiveLink(link.subLinks);
          if (activeSubLink) return link.title;
        }
      }
      return null;
    };

    setActiveLink(findActiveLink(links));
  }, [pathname, links]);

  const handleLinkClick = (title: string) => {
    setActiveLink(activeLink === title ? null : title);
  };

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 px-[6px] py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) => (
            <div key={index}>
              <div
                onClick={() => link.subLinks && handleLinkClick(link.title)}
                className={cn(
                  "flex cursor-pointer items-center justify-between",
                  link.subLinks ? "font-bold" : "",
                )}
              >
                {isCollapsed ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          buttonVariants({
                            variant:
                              link.href === pathname ? "default" : "ghost",
                            size: "icon",
                          }),
                          "h-12 w-12",
                          link.variant === "default" &&
                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                          !isCollapsed &&
                            link.href === pathname &&
                            "border-l-[4px]",

                          link.href === pathname && "bg-neutral-150",
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {link.title}
                      {link.label && (
                        <span className="text-muted-foreground">
                          {link.label}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.href === pathname ? "default" : "ghost",
                        size: "sm",
                      }),
                      link.variant === "default" &&
                        "dark:text-white dark:hover:text-white",
                      "w-full justify-start",
                      "h-12",
                      !isCollapsed && link.href === pathname && "rounded-lg",
                      link.href === pathname && "bg-neutral-150",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <link.icon className="mr-2 h-5 w-5" />
                        {link.title}
                      </div>
                      {link.subLinks && (
                        <div className="ml-2">
                          {activeLink === link.title ? (
                            <FaChevronDown size={16} />
                          ) : (
                            <FaChevronRight size={16} />
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>

              {link.subLinks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    activeLink === link.title
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className={cn("overflow-hidden", {
                    "ml-[0.8rem]": isCollapsed,
                  })}
                >
                  <div className="mt-2 grid gap-4">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Tooltip key={subIndex} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={subLink.href}
                            className={cn(
                              buttonVariants({
                                variant:
                                  subLink.href === pathname
                                    ? "default"
                                    : "ghost",
                                size: isCollapsed ? "icon" : "sm",
                              }),
                              subLink.variant === "default" &&
                                !isCollapsed &&
                                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                              "flex items-center justify-start gap-2",
                              "h-12 rounded-l-md",
                              "ml-4",
                              !isCollapsed &&
                                subLink.href === pathname &&
                                "ml-[4px] rounded-r-none p-2",
                              isCollapsed &&
                                subLink.href === pathname &&
                                "px-2",
                              subLink.href === pathname && "ml-4 text-red-500",
                            )}
                          >
                            <subLink.icon className="h-5 w-5" />
                            {!isCollapsed && subLink.title}{" "}
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {subLink.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
