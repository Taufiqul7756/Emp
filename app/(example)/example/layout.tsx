import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example",
  description: "Some example of different packages",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
