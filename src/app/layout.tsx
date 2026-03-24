import type { Metadata } from "next";
import { Sora, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Neutron",
  description: "Neutron.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", sora.variable, "font-sans", geist.variable)}>
      <body className={`${sora.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
