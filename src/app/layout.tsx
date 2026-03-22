import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neutron Flight Deck",
  description: "Smooth 3D orbit landing page with routed planetary destinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
