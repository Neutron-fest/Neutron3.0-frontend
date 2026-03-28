import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import {
  connectSocket,
  disconnectSocket,
  isSocketConnectionAllowed,
  waitForSocketConnection,
} from "@/lib/socket";

// ---- Types ----
type ApiErrorResponse = {
  error?: string;
  message?: string;
};

type ExtendedAxiosError = AxiosError<ApiErrorResponse> & {
  config: InternalAxiosRequestConfig & {
    _retry?: boolean;
  };
};

// ---- Constants ----
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// ---- Helpers ----
const isExplicitAuthRejection = (error: unknown): boolean => {
  const err = error as AxiosError<ApiErrorResponse>;
  const status = err?.response?.status;
  const code = err?.response?.data?.error;

  if (status !== 401 && status !== 403) return false;
  return !!code && AUTH_REJECTION_ERRORS.has(code);
};

const emitServerRejectedAuth = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth:server-rejected"));
};

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/google",
  "/auth/google/callback",
  "/auth/verify-email",
  "/auth/resend-verification-public",
  "/auth/password-reset/request",
  "/auth/password-reset/confirm",
  "/auth/invite/validate",
  "/auth/invite/accept",
];

const isPublicPath = (url: string = ""): boolean => {
  return PUBLIC_PATHS.some((path) => url.includes(path));
};

const buildSocketRequiredError = (): AxiosError<ApiErrorResponse> => {
  const error = new Error(
    "Active socket connection required.",
  ) as AxiosError<ApiErrorResponse>;

  error.response = {
    status: 401,
    statusText: "Unauthorized",
    headers: {},
    config: {} as any,
    data: {
      error: "SOCKET_NOT_CONNECTED",
      message: "Active socket connection required.",
    },
  };

  return error;
};

// ---- Socket recovery ----
const recoverSocketWithRefresh = async (): Promise<boolean> => {
  try {
    await apiClient.post("/auth/refresh");
    connectSocket();
    const reconnected = await waitForSocketConnection(2000);
    return reconnected || isSocketConnectionAllowed();
  } catch (refreshError) {
    if (isExplicitAuthRejection(refreshError)) {
      disconnectSocket();
      emitServerRejectedAuth();
    }
    return false;
  }
};

const ensureSocketAccessForProtectedRequest = async (): Promise<boolean> => {
  if (isSocketConnectionAllowed()) return true;

  connectSocket();
  const reconnected = await waitForSocketConnection(2000);

  if (reconnected || isSocketConnectionAllowed()) return true;

  return recoverSocketWithRefresh();
};

// ---- Refresh queue ----
let refreshPromise: Promise<AxiosResponse> | null = null;
const pendingRequests: Array<() => void> = [];

const onRefreshed = (): void => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests.length = 0;
};

const addPendingRequest = (callback: () => void): void => {
  pendingRequests.push(callback);
};

// ---- Axios instance ----
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ---- Request interceptor ----
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    if (typeof window !== "undefined" && !isPublicPath(config.url || "")) {
      const hasSocketAccess = await ensureSocketAccessForProtectedRequest();
      if (!hasSocketAccess) {
        return Promise.reject(buildSocketRequiredError());
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor ----
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: ExtendedAxiosError) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const skipRefreshPaths = ["/auth/refresh", "/auth/login", "/auth/logout"];
    const shouldSkipRefresh = skipRefreshPaths.some((path) =>
      originalRequest.url?.includes(path),
    );

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      if (refreshPromise) {
        return new Promise((resolve) => {
          addPendingRequest(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }

      refreshPromise = apiClient
        .post("/auth/refresh")
        .then(() => {
          refreshPromise = null;
          onRefreshed();
          return apiClient(originalRequest);
        })
        .catch((refreshError) => {
          refreshPromise = null;

          if (isExplicitAuthRejection(refreshError)) {
            disconnectSocket();
            emitServerRejectedAuth();
          }

          return Promise.reject(refreshError);
        });

      return refreshPromise;
    }

    if (shouldSkipRefresh && isExplicitAuthRejection(error)) {
      disconnectSocket();
      emitServerRejectedAuth();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
