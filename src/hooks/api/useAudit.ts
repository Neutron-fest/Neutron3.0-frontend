import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

/**
 * Types
 */

export interface AuditLog {
  _id: string;
  action: string;
  user?: string;
  createdAt: string;
  [key: string]: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: Pagination | null;
}

export interface AuditStats {
  totalLogs?: number;
  anomalies?: number;
  [key: string]: any;
}

export interface Anomaly {
  _id: string;
  type?: string;
  severity?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface AnomaliesResponse {
  anomalies: Anomaly[];
  pagination: Pagination | null;
}

export type Filters = Record<string, any>;

/**
 * Query Keys
 */
const auditKeys = {
  all: ["audit"] as const,
  logs: (filters?: Filters) => [...auditKeys.all, "logs", filters] as const,
  stats: (filters?: Filters) => [...auditKeys.all, "stats", filters] as const,
  anomalies: (filters?: Filters) =>
    [...auditKeys.all, "anomalies", filters] as const,
};

/**
 * Get paginated audit logs
 */
export function useAuditLogs(filters: Filters = {}) {
  return useQuery<AuditLogsResponse>({
    queryKey: auditKeys.logs(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/audit/logs", {
        params: filters,
      });

      const inner = data?.data || data;

      return {
        logs: inner?.logs || [],
        pagination: inner?.pagination || null,
      };
    },
  });
}

/**
 * Get audit statistics
 */
export function useAuditStats(filters: Filters = {}) {
  return useQuery<AuditStats | null>({
    queryKey: auditKeys.stats(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/audit/stats", {
        params: filters,
      });
      return data?.data || data || null;
    },
  });
}

/**
 * Get anomalies
 */
export function useAnomalies(filters: Filters = {}) {
  return useQuery<AnomaliesResponse>({
    queryKey: auditKeys.anomalies(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/audit/anomalies", {
        params: filters,
      });

      const inner = data?.data || data;

      return {
        anomalies: inner?.anomalies || [],
        pagination: inner?.pagination || null,
      };
    },
  });
}

/**
 * Resolve an anomaly
 */
export function useResolveAnomaly() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { id: string; resolutionNotes?: string }
  >({
    mutationFn: async ({ id, resolutionNotes }) => {
      const { data } = await apiClient.post(
        `/audit/anomalies/${id}/resolve`,
        { resolutionNotes }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
}

/**
 * Export audit logs CSV
 */
export function exportAuditLogsCsv(filters: Filters = {}): void {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v != null && v !== "")
    )
  ).toString();

  const url = `/api/v1/audit/logs/export/csv${
    params ? `?${params}` : ""
  }`;

  window.open(url, "_blank");
}