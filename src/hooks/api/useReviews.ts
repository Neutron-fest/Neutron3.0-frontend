import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/* ================= TYPES ================= */

export interface Proposal {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  [key: string]: any;
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
}

export interface ReviewListResponse {
  proposals: Proposal[];
  pagination: Pagination | null;
}

export interface Filters {
  [key: string]: any;
}

export interface ApprovePayload {
  proposalId: string;
  reviewNotes?: string;
}

export interface RejectPayload {
  proposalId: string;
  rejectionReason?: string;
  reviewNotes?: string;
}

/* ================= HELPERS ================= */

const unwrap = <T>(data: any): T => data?.data ?? data;

/* ================= HOOKS ================= */

export function useReviewProposals(filters: Filters = {}) {
  return useQuery<ReviewListResponse>({
    queryKey: queryKeys.reviews.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/reviews/proposals", {
        params: filters,
      });

      return (
        unwrap<ReviewListResponse>(data) || {
          proposals: [],
          pagination: null,
        }
      );
    },
  });
}

export function useReviewProposalDetail(proposalId?: string) {
  return useQuery<Proposal | null>({
    queryKey: queryKeys.reviews.detail(proposalId?? ""),
    enabled: !!proposalId,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/reviews/proposals/${proposalId}`
      );

      return unwrap<{ proposal: Proposal }>(data)?.proposal || null;
    },
  });
}

export function useApproveReviewProposal() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ApprovePayload>({
    mutationFn: async ({ proposalId, reviewNotes }) => {
      const { data } = await apiClient.post(
        `/reviews/proposals/${proposalId}/approve`,
        { reviewNotes }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.proposalId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.club.proposals.all(),
      });
    },
  });
}

export function useRejectReviewProposal() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, RejectPayload>({
    mutationFn: async ({ proposalId, rejectionReason, reviewNotes }) => {
      const { data } = await apiClient.post(
        `/reviews/proposals/${proposalId}/reject`,
        {
          rejectionReason,
          reviewNotes,
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.proposalId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.club.proposals.all(),
      });
    },
  });
}