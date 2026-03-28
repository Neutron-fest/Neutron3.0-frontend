import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

type ApprovalId = string | number;
type ApprovalFilters = Record<string, unknown>;
type ApprovePayload = { approvalId: ApprovalId; [key: string]: unknown };
type RejectPayload = { approvalId: ApprovalId; reason?: string };

/**
 * Fetch all approvals with optional filters
 */
export function useApprovals(filters: ApprovalFilters = {}) {
  return useQuery({
    queryKey: queryKeys.approvals.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/sa/approvals", {
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
  return useQuery({
    queryKey: queryKeys.approvals.pending(),
    queryFn: async () => {
      const { data } = await apiClient.get("/sa/approvals/pending");
      return data;
    },
  });
}

/**
 * Fetch single approval by ID
 */
export function useApproval(approvalId: ApprovalId) {
  return useQuery({
    queryKey: queryKeys.approvals.detail(approvalId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/sa/approvals/${approvalId}`);
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

  return useMutation({
    mutationFn: async ({ approvalId, ...approvalData }: ApprovePayload) => {
      const { data } = await apiClient.post(
        `/sa/approvals/${approvalId}/approve`,
        approvalData,
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

  return useMutation({
    mutationFn: async ({ approvalId, reason }: RejectPayload) => {
      const { data } = await apiClient.post(
        `/sa/approvals/${approvalId}/reject`,
        { reason },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
    },
  });
}

/**
 * Fetch approval stats (pending count, breakdown by status+type)
 */
export function useApprovalStats() {
  return useQuery({
    queryKey: [...queryKeys.approvals.all, "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get("/sa/approvals/stats");
      return data?.data;
    },
  });
}
