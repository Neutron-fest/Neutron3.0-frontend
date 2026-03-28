import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

/* ================= TYPES ================= */

type PublicUserProfile = {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  [key: string]: any;
};

type ApiResponse<T> = {
  data?: T;
};

/* ================= QUERY ================= */

export function usePublicUserProfile(userId?: string) {
  return useQuery<PublicUserProfile | null>({
    queryKey: queryKeys.publicProfiles.detail(userId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PublicUserProfile>>(
        `/auth/users/${userId}/profile`
      );

      return data?.data ?? null;
    },
    enabled: Boolean(userId),
  });
}