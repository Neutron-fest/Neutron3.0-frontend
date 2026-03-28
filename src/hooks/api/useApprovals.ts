import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/**
 * Types
 */
export interface Approval {
  _id: string;
  status: "pending" | "approved" | "rejected";
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  // add more fields based on your backend
}

export interface ApprovalStats {
  pendingCount: number;
  breakdown: Record<string, number>;
}

export interface ApprovalFilters {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch all approvals with optional filters
 */
export function useApprovals(filters: ApprovalFilters = {}) {
  return useQuery<Approval[]>({
    queryKey: queryKeys.approvals.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<Approval[]>("/sa/approvals", {
        params: filters,
      });
      return data;
    },
  });
}

/**
 * Fetch pending approvals
 */
export function usePendingApprovals() {
  return useQuery<Approval[]>({
    queryKey: queryKeys.approvals.pending(),
    queryFn: async () => {
      const { data } = await apiClient.get<Approval[]>("/sa/approvals/pending");
      return data;
    },
  });
}

/**
 * Fetch single approval by ID
 */
export function useApproval(approvalId?: string) {
  return useQuery<Approval>({
    queryKey: queryKeys.approvals.detail(approvalId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<Approval>(
        `/sa/approvals/${approvalId ?? ""}`
      );
      return data;
    },
    enabled: !!approvalId,
  });
}

/**
 * Approve an approval request
 */
export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Approval, // response type
    Error, // error type
    { approvalId: string; [key: string]: any } // variables
  >({
    mutationFn: async ({ approvalId, ...approvalData }) => {
      const { data } = await apiClient.post<Approval>(
        `/sa/approvals/${approvalId}/approve`,
        approvalData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
    },
  });
}

/**
 * Reject an approval request
 */
export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Approval,
    Error,
    { approvalId: string; reason: string }
  >({
    mutationFn: async ({ approvalId, reason }) => {
      const { data } = await apiClient.post<Approval>(
        `/sa/approvals/${approvalId}/reject`,
        { reason }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
    },
  });
}

/**
 * Fetch approval stats
 */
export function useApprovalStats() {
  return useQuery<ApprovalStats>({
    queryKey: [...queryKeys.approvals.all, "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: ApprovalStats }>(
        "/sa/approvals/stats"
      );
      return data?.data;
    },
  });
}

/**
 * Fetch user's own approval requests
 */
export function useMyApprovalRequests(filters: ApprovalFilters = {}) {
  return useQuery<Approval[]>({
    queryKey: queryKeys.approvals.myRequests(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Approval[] }>(
        "/auth/my-requests",
        { params: filters }
      );
      return data?.data;
    },
  });
}