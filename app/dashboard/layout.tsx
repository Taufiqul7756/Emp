import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LayoutProvider from "@/components/LayoutProvider";

export const metadata: Metadata = {
  title: "Employee Management Panel",
  description: "Employee Management Panel",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
