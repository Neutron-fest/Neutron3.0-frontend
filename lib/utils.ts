import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ================= UTILS ================= */

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

/* ================= DATE ================= */

export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string | number): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ================= USER ================= */

export function getInitials(name?: string): string {
  if (!name) return "?";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

/* ================= ROLE ================= */

export type Role = "SA" | "DH" | "VH" | "VOL" | "PART";

export function getRoleColor(role?: Role): string {
  const colors: Record<Role, string> = {
    SA: "bg-red-500/10 text-red-500 border-red-500/20",
    DH: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    VH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    VOL: "bg-green-500/10 text-green-500 border-green-500/20",
    PART: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return role
    ? colors[role]
    : "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

/* ================= DEBOUNCE ================= */

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}