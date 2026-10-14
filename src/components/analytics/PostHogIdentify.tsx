"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { identifyUser } from "@/lib/analytics";

/** Ties PostHog's distinct id to the signed-in Neutron user. Reset happens on logout in AuthContext. */
export default function PostHogIdentify() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?.id) return;
    identifyUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }, [loading, user]);

  return null;
}
