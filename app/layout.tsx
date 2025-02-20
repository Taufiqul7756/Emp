import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/LayoutProvider";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/provider/QueryClientProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthProvider from "./provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Management Panel",
  description: "Employee Management Panel",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen w-full flex-col text-black",
          inter.className,
        )}
      >
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReactQueryProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
