"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ClientLoadingWrapper from "@/components/ClientLoadingWrapper";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

interface RouteAwareRootShellProps {
  children: React.ReactNode;
}

export default function RouteAwareRootShell({
  children,
}: RouteAwareRootShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    if (isAdminRoute) {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
      body.style.overscrollBehavior = "auto";
    } else {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.overscrollBehavior = prevBodyOverscroll;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <ClientLoadingWrapper>
        <PageTransition>{children}</PageTransition>
      </ClientLoadingWrapper>
    </SmoothScroll>
  );
}
