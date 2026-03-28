import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Tailwind class merger
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ✅ Date formatting
export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | number | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ✅ Initials generator
export function getInitials(name?: string): string {
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ✅ Role colors (typed keys)
type Role = "SA" | "DH" | "VH" | "VOL" | "PART";

const roleColors: Record<Role, string> = {
  SA: "bg-red-500/10 text-red-500 border-red-500/20",
  DH: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  VH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  VOL: "bg-green-500/10 text-green-500 border-green-500/20",
  PART: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

export function getRoleColor(role?: Role): string {
  if (!role) {
    return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
  return roleColors[role] ?? "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

// ✅ Generic debounce (high-value TS)
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
