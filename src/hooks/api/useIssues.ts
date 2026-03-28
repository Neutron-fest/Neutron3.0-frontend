import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/* ================= TYPES ================= */

type Issue = {
  id: string;
  message: string;
  image?: string;
  resolved?: boolean;
  [key: string]: any;
};

type ApiResponse<T> = {
  data?: {
    issues?: T[];
  };
};

type MutationResponse = any;

/* ================= QUERIES ================= */

export function useIssues(filters: Record<string, any> = {}) {
  return useQuery<Issue[]>({
    queryKey: queryKeys.issues.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Issue>>("/issues", {
        params: filters,
      });

      return data?.data?.issues || [];
    },
  });
}

/* ================= MUTATIONS ================= */

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<
    MutationResponse,
    Error,
    { message: string; image?: File | null }
  >({
    mutationFn: async ({ message, image }) => {
      const hasImage = image instanceof File;

      if (!hasImage) {
        const { data } = await apiClient.post("/issues", { message });
        return data;
      }

      const formData = new FormData();
      formData.append("message", message);
      formData.append("image", image);

      const { data } = await apiClient.post("/issues", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
      });
    },
  });
}

export function useResolveIssue() {
  const queryClient = useQueryClient();

  return useMutation<
    MutationResponse,
    Error,
    { issueId: string }
  >({
    mutationFn: async ({ issueId }) => {
      const { data } = await apiClient.patch(
        `/issues/${issueId}/resolve`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.all,
      });
    },
  });
}