import { io, Socket } from "socket.io-client";
import { getApiOriginBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = getApiOriginBaseUrl();

const SOCKET_GRACE_MS = Number.parseInt(
  process.env.NEXT_PUBLIC_SOCKET_RECONNECT_GRACE_MS || "7000",
  10,
);


type ForceLogoutPayload = { code?: string; reason?: string };
type Listeners = {
  onForceLogout: ((payload?: ForceLogoutPayload) => void) | null;
  onConnect: (() => void) | null;
  onDisconnect: ((reason?: string) => void) | null;
  onConnectError: ((error?: any) => void) | null;
};

let socket: Socket | null = null;
let connected = false;
let initialized = false;
let lastDisconnectedAt: number | null = null;
let listeners: Listeners = {
  onForceLogout: null,
  onConnect: null,
  onDisconnect: null,
  onConnectError: null,
};

const isPublicSocketError = (error: any): boolean => {
  const code = error?.data?.code || error?.code || "";
  return code === "UNAUTHORIZED";
};

const setConnected = (nextConnected: boolean): void => {
  connected = nextConnected;
  if (!nextConnected) {
    lastDisconnectedAt = Date.now();
  } else {
    lastDisconnectedAt = null;
  }
};

export const initSocket = ({
  onForceLogout,
  onConnect,
  onDisconnect,
  onConnectError,
}: Partial<Listeners> = {}): Socket => {
  listeners = {
    onForceLogout: onForceLogout || null,
    onConnect: onConnect || null,
    onDisconnect: onDisconnect || null,
    onConnectError: onConnectError || null,
  };

  if (initialized && socket) {
    return socket;
  }

  socket = io(API_BASE_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
    timeout: 10000,
  });

  socket.on("connect", () => {
    setConnected(true);
    listeners.onConnect?.();
  });

  socket.on("disconnect", (reason: string) => {
    setConnected(false);
    listeners.onDisconnect?.(reason);
  });

  socket.on("connect_error", (error: any) => {
    setConnected(false);
    listeners.onConnectError?.(error);

    if (isPublicSocketError(error)) {
      listeners.onForceLogout?.({
        code: "UNAUTHORIZED",
        reason: "UNAUTHORIZED",
      });
    }
  });

  socket.on("force_logout", (payload?: ForceLogoutPayload) => {
    listeners.onForceLogout?.(payload);
  });

  initialized = true;
  return socket;
};

export const connectSocket = (): void => {
  if (!socket) return;
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = (): void => {
  if (!socket) return;
  socket.disconnect();
};

export const getSocket = (): Socket | null => socket;

export const isSocketConnected = (): boolean => connected;

export const isSocketConnectionAllowed = (): boolean => {
  if (connected) return true;
  if (!lastDisconnectedAt) return false;
  return Date.now() - lastDisconnectedAt <= SOCKET_GRACE_MS;
};

export const waitForSocketConnection = async (timeoutMs: number = 2500): Promise<boolean> => {
  if (!socket) return false;
  if (socket.connected) return true;

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onConnect = () => {
      cleanup();
      resolve(true);
    };

    const cleanup = () => {
      window.clearTimeout(timeout);
      socket?.off("connect", onConnect);
    };

    socket?.on("connect", onConnect);
  });
};
