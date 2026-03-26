import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

export function useIssues(filters = {}) {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
    },
  });
}

export function useResolveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId }) => {
      const { data } = await apiClient.patch(`/issues/${issueId}/resolve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
    },
  });
}
