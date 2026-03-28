import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

type Filters = Record<string, unknown>;
type CreateIssuePayload = { message: string };
type ResolveIssuePayload = { issueId: string | number };

export function useIssues(filters: Filters = {}) {
  return useQuery({
    queryKey: queryKeys.issues.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/issues", { params: filters });
      return data?.data?.issues || [];
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message }: CreateIssuePayload) => {
      const { data } = await apiClient.post("/issues", { message });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
    },
  });
}

export function useResolveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId }: ResolveIssuePayload) => {
      const { data } = await apiClient.patch(`/issues/${issueId}/resolve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
    },
  });
}
