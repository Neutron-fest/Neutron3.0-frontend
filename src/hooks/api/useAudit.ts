import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

type AuditFilters = Record<string, unknown>;
type ResolveAnomalyPayload = {
  id: string | number;
  resolutionNotes?: string;
};

const auditKeys = {
  all: ["audit"],
  logs: (filters: AuditFilters) => [...auditKeys.all, "logs", filters],
  stats: (filters: AuditFilters) => [...auditKeys.all, "stats", filters],
  anomalies: (filters: AuditFilters) => [
    ...auditKeys.all,
    "anomalies",
    filters,
  ],
};

/**
 * Get paginated audit logs
 * GET /api/v1/audit/logs
 */
export function useAuditLogs(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: auditKeys.logs(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/audit/logs", { params: filters });
      const inner = data?.data || data;
      return {
        logs: inner?.logs || [],
        pagination: inner?.pagination || null,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Get audit statistics
 * GET /api/v1/audit/stats
 */
export function useAuditStats(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: auditKeys.stats(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/audit/stats", { params: filters });
      return data?.data || data || null;
    },
  });
}

/**
 * Get anomalies
 * GET /api/v1/audit/anomalies
 */
export function useAnomalies(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: auditKeys.anomalies(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/audit/anomalies", {
        params: filters,
      });
      const inner = data?.data || data;
      return {
        anomalies: inner?.anomalies || [],
        pagination: inner?.pagination || null,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Resolve an anomaly
 * POST /api/v1/audit/anomalies/:id/resolve
 */
export function useResolveAnomaly() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolutionNotes }: ResolveAnomalyPayload) => {
      const { data } = await apiClient.post(`/audit/anomalies/${id}/resolve`, {
        resolutionNotes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
}

/**
 * Export audit logs CSV
 * GET /api/v1/audit/logs/export/csv
 */
export function exportAuditLogsCsv(filters: AuditFilters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const url = `/api/v1/audit/logs/export/csv${params ? `?${params}` : ""}`;
  window.open(url, "_blank");
}
