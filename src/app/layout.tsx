import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono, Audiowide, Orbitron, Rubik_Glitch } from "next/font/google";
import "./globals.css";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rubicglitch = Rubik_Glitch({
  variable: "--font-rubicglitch",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "Photon",
  description: "Advanced Agentic Coding",
};

import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${audiowide.variable} ${orbitron.variable} ${rubicglitch.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-clip">
        <SmoothScroll>
          <Navbar />
          <ClientLoadingWrapper>
            <PageTransition>{children}</PageTransition>
          </ClientLoadingWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
