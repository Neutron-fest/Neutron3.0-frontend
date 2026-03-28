"use client";

import { useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// ---- Types ----
type Role = "SA" | "DH" | "VH" | "JUDGE" | string;

// ---- HOC ----
export default function withAuth<P extends object>(
  Component: ComponentType<P>,
  allowedRoles: Role[] = [],
) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/admin/auth");
        } else if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role as Role)
        ) {
          router.replace("/admin/unauthorized");
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      );
    }

    if (
      !user ||
      (allowedRoles.length > 0 && !allowedRoles.includes(user.role as Role))
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}
