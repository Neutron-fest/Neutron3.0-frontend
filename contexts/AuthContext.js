"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const buildFallbackDeviceName = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  let platform = "";
  if (ua.includes("android")) platform = "Android";
  else if (ua.includes("iphone")) platform = "iPhone";
  else if (ua.includes("ipad")) platform = "iPad";
  else if (ua.includes("mac os x")) platform = "macOS";
  else if (ua.includes("windows")) platform = "Windows";
  else if (ua.includes("linux")) platform = "Linux";

  let browser = "";
  if (ua.includes("samsungbrowser")) browser = "Samsung Internet";
  else if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("opr/") || ua.includes("opera")) browser = "Opera";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (
    ua.includes("chrome/") &&
    !ua.includes("edg/") &&
    !ua.includes("opr/")
  )
    browser = "Chrome";
  else if (
    ua.includes("safari/") &&
    !ua.includes("chrome/") &&
    !ua.includes("chromium")
  )
    browser = "Safari";

  if (platform && browser) return `${platform} ${browser}`;
  return platform || browser || null;
};

const getClientDeviceName = async () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  try {
    if (navigator.userAgentData?.getHighEntropyValues) {
      const values = await navigator.userAgentData.getHighEntropyValues([
        "model",
        "platform",
      ]);

      const model = values?.model?.trim();
      const platform = values?.platform?.trim();

      if (model) {
        const normalizedModel = /^SM-/i.test(model)
          ? `Samsung ${model.toUpperCase()}`
          : model;

        if (platform) {
          return `${normalizedModel} ${platform}`;
        }

        return normalizedModel;
      }

      if (platform) {
        return buildFallbackDeviceName(navigator.userAgent) || platform;
      }
    }
  } catch {
    // Fall back to user-agent-derived naming below.
  }

  return buildFallbackDeviceName(navigator.userAgent);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      // 401 is expected when not authenticated, so don't log it
      if (error.response?.status !== 401) {
        console.error("Auth check failed:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const deviceName = await getClientDeviceName();
      const response = await apiClient.post("/auth/login", {
        ...credentials,
        ...(deviceName ? { deviceName } : {}),
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Logout errors are usually not critical, only log non-401 errors
      if (error.response?.status !== 401) {
        console.error("Logout error:", error);
      }
    } finally {
      setUser(null);
      router.push("/admin/auth");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isSA: user?.role === "SA",
    isDH: user?.role === "DH",
    isVH: user?.role === "VH",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
