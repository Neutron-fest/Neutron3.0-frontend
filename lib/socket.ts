import { io, type Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const SOCKET_GRACE_MS = Number.parseInt(
  process.env.NEXT_PUBLIC_SOCKET_RECONNECT_GRACE_MS || "7000",
  10,
);

// ---- Types ----
type ForceLogoutPayload = {
  code: string;
  reason: string;
};

type SocketListeners = {
  onForceLogout?: (payload: ForceLogoutPayload) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onConnectError?: (error: unknown) => void;
};

// ---- State ----
let socket: Socket | null = null;
let connected = false;
let initialized = false;
let lastDisconnectedAt: number | null = null;

let listeners: Required<SocketListeners> = {
  onForceLogout: () => {},
  onConnect: () => {},
  onDisconnect: () => {},
  onConnectError: () => {},
};

// ---- Helpers ----
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

// ---- Init ----
export const initSocket = (opts: SocketListeners = {}): Socket => {
  listeners = {
    onForceLogout: opts.onForceLogout ?? (() => {}),
    onConnect: opts.onConnect ?? (() => {}),
    onDisconnect: opts.onDisconnect ?? (() => {}),
    onConnectError: opts.onConnectError ?? (() => {}),
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
    listeners.onConnect();
  });

  socket.on("disconnect", (reason: string) => {
    setConnected(false);
    listeners.onDisconnect(reason);
  });

  socket.on("connect_error", (error: unknown) => {
    setConnected(false);
    listeners.onConnectError(error);

    if (isPublicSocketError(error)) {
      listeners.onForceLogout({
        code: "UNAUTHORIZED",
        reason: "UNAUTHORIZED",
      });
    }
  });

  socket.on("force_logout", (payload: ForceLogoutPayload) => {
    listeners.onForceLogout(payload);
  });

  initialized = true;
  return socket;
};

// ---- Controls ----
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

// ---- Async wait ----
export const waitForSocketConnection = async (
  timeoutMs = 2500,
): Promise<boolean> => {
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

    socket.on("connect", onConnect);
  });
};
