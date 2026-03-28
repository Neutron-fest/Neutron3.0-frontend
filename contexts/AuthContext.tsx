"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import apiClient from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  isSocketConnectionAllowed,
  waitForSocketConnection,
} from "@/lib/socket";
import type { AxiosError } from "axios";

// ---- Types ----
type User = {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    credentials: Record<string, unknown>,
  ) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    errorCode?: string;
  }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isSocketReady: boolean;
  isSA: boolean;
  isDH: boolean;
  isVH: boolean;
  isJudge: boolean;
};

type ApiError = {
  error?: string;
  message?: string;
};

// ---- Context ----
const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_USER_CACHE_KEY = "neutron.auth.user";

const AUTH_REJECTION_ERRORS = new Set<string>([
  "UNAUTHORIZED",
  "INVALID_ACCESS_TOKEN",
  "ACCESS_TOKEN_EXPIRED",
  "INVALID_REFRESH_TOKEN",
  "REFRESH_TOKEN_EXPIRED",
  "SESSION_NOT_FOUND",
  "SESSION_REVOKED",
  "SESSION_EXPIRED",
  "USER_NOT_FOUND",
  "ACCOUNT_SUSPENDED",
  "ACCOUNT_REVOKED",
]);

// ---- Helpers ----
const isExplicitAuthRejection = (error: unknown): boolean => {
  const err = error as AxiosError<ApiError>;
  const status = err?.response?.status;
  const code = err?.response?.data?.error;

  if (status !== 401 && status !== 403) return false;
  return !!code && AUTH_REJECTION_ERRORS.has(code);
};

const getCachedUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const cacheUser = (user: User | null): void => {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(AUTH_USER_CACHE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
};

// ---- Device detection (kept mostly loose intentionally) ----
const buildFallbackDeviceName = (userAgent: string = ""): string | null => {
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
  else if (ua.includes("safari/") && !ua.includes("chrome/"))
    browser = "Safari";

  if (platform && browser) return `${platform} ${browser}`;
  return platform || browser || null;
};

const getClientDeviceName = async (): Promise<string | null> => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  try {
    if ((navigator as any).userAgentData?.getHighEntropyValues) {
      const values = await (
        navigator as any
      ).userAgentData.getHighEntropyValues(["model", "platform"]);

      const model = values?.model?.trim();
      const platform = values?.platform?.trim();

      if (model) {
        const normalizedModel = /^SM-/i.test(model)
          ? `Samsung ${model.toUpperCase()}`
          : model;

        return platform ? `${normalizedModel} ${platform}` : normalizedModel;
      }

      if (platform) {
        return buildFallbackDeviceName(navigator.userAgent) || platform;
      }
    }
  } catch {}

  return buildFallbackDeviceName(navigator.userAgent);
};

// ---- Provider ----
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false);

  const router = useRouter();

  const clearUserAndRedirect = useCallback(() => {
    setUser(null);
    cacheUser(null);
    disconnectSocket();
    router.push("/admin/auth");
  }, [router]);

  useEffect(() => {
    initSocket({
      onConnect: () => setIsSocketReady(true),
      onDisconnect: (reason) => {
        setIsSocketReady(false);
        if (reason === "io server disconnect") {
          clearUserAndRedirect();
        }
      },
      onForceLogout: clearUserAndRedirect,
      onConnectError: () => setIsSocketReady(false),
    });

    connectSocket();

    const bootstrap = async () => {
      await waitForSocketConnection(1500);
      await checkAuth();
    };

    bootstrap();

    return () => disconnectSocket();
  }, [clearUserAndRedirect]);

  useEffect(() => {
    const handler = () => {
      disconnectSocket();
      clearUserAndRedirect();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:server-rejected", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:server-rejected", handler);
      }
    };
  }, [clearUserAndRedirect]);

  const checkAuth = async (): Promise<void> => {
    try {
      if (!isSocketConnectionAllowed()) {
        connectSocket();
        await waitForSocketConnection(2500);
      }

      const response = await apiClient.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.data.user);
        cacheUser(response.data.data.user);
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      if (err?.response?.data?.error === "SOCKET_NOT_CONNECTED") {
        console.warn("Auth check paused until socket reconnects.");
      }

      if (isExplicitAuthRejection(err)) {
        setUser(null);
        cacheUser(null);
      } else if (err.response?.status && err.response.status >= 500) {
        console.warn("Auth check skipped due to backend issue.");
      } else if (!err.response) {
        console.warn("Network issue during auth check.");
      } else if (err.response.status !== 401) {
        console.error("Auth check failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    credentials: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    errorCode?: string;
  }> => {
    try {
      const deviceName = await getClientDeviceName();

      const response = await apiClient.post("/auth/login", {
        ...credentials,
        ...(deviceName ? { deviceName } : {}),
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        cacheUser(response.data.data.user);

        connectSocket();
        await waitForSocketConnection(2000);

        return { success: true, user: response.data.data.user };
      }

      return { success: false };
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      return {
        success: false,
        errorCode: err.response?.data?.error,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status !== 401) {
        console.error("Logout error:", err);
      }
    } finally {
      disconnectSocket();
      setUser(null);
      cacheUser(null);
      router.push("/admin/auth");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isSocketReady,
    isSA: user?.role === "SA",
    isDH: user?.role === "DH",
    isVH: user?.role === "VH",
    isJudge: user?.role === "JUDGE",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---- Hook ----
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
