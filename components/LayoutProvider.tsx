"use client";

import { useState } from "react";
import { ThemeProvider } from "@/provider/ThemeProvider";
import ReactQueryProvider from "@/provider/QueryClientProvider";
import SideNavbar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import LoginPage from "@/components/LoginPage";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type LayoutProviderProps = {
  children: React.ReactNode;
};

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* {!isLoggedIn && pathname === "/" ? (
        <div>
          <LoginPage />
        </div>
      ) : ( */}
      <ThemeProvider>
        <ReactQueryProvider>
          <Navbar setIsLoggedIn={setIsLoggedIn} />
          <div className="flex flex-1">
            <SideNavbar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
            <motion.div
              className={cn(
                "flex min-h-screen w-full flex-grow flex-col bg-[#F7F8F8]",
              )}
              initial={false}
              animate={{
                paddingLeft: isCollapsed
                  ? "var(--collapsed-sidebar-width)"
                  : "var(--sidebar-width)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-16 w-full flex-grow bg-[#F5F7FA] pb-5 pt-16 dark:bg-slate-400">
                {children}
              </div>
              <Footer />
            </motion.div>
          </div>
        </ReactQueryProvider>
      </ThemeProvider>
      {/* )} */}
    </>
  );
}
