import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

const unwrap = (data) => data?.data ?? data;

export function useReviewProposals(filters = {}) {
  return useQuery({
    queryKey: queryKeys.reviews.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews/proposals", {
        params: filters,
      });
      return unwrap(data) || { proposals: [], pagination: null };
    },
  });
}

export function useReviewProposalDetail(proposalId) {
  return useQuery({
    queryKey: queryKeys.reviews.detail(proposalId),
    enabled: !!proposalId,
    queryFn: async () => {
      const { data } = await apiClient.get(`/reviews/proposals/${proposalId}`);
      return unwrap(data)?.proposal || null;
    },
  });
}

export function useApproveReviewProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, reviewNotes }) => {
      const { data } = await apiClient.post(
        `/reviews/proposals/${proposalId}/approve`,
        { reviewNotes },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
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

  return useMutation({
    mutationFn: async ({ proposalId, rejectionReason, reviewNotes }) => {
      const { data } = await apiClient.post(
        `/reviews/proposals/${proposalId}/reject`,
        {
          rejectionReason,
          reviewNotes,
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.proposalId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.proposals.all(),
      });
    },
  });
}
