import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/**
 * Types
 */

export interface Club {
  _id: string;
  name: string;
  members?: any[];
  membersCount?: number;
  memberCount?: number;
  members_count?: number;
  [key: string]: any;
}

export interface NormalizedClub extends Club {
  membersCount: number;
}

export interface ClubFilters {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

export interface AssignUserPayload {
  clubId: string;
  userId: string;
  role?: string;
}

/**
 * Normalize club
 */
const normalizeClub = (club: Club): NormalizedClub => ({
  ...club,
  membersCount:
    club?.membersCount ??
    club?.memberCount ??
    club?.members_count ??
    (Array.isArray(club?.members) ? club.members.length : 0),
});

/**
 * Get clubs list
 */
export function useClubs(filters: ClubFilters = {}) {
  return useQuery<NormalizedClub[]>({
    queryKey: queryKeys.clubs.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/sa/clubs", {
        params: filters,
      });

      const clubs =
        data?.data?.clubs ||
        data?.clubs ||
        [];

      return clubs.map(normalizeClub);
    },
  });
}

/**
 * Get single club
 */
export function useClub(clubId?: string) {
  return useQuery<NormalizedClub | null>({
    queryKey: queryKeys.clubs.detail(clubId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/sa/clubs/${clubId ?? ""}`
      );

      const club = data?.data?.club || data?.club;
      return club ? normalizeClub(club) : null;
    },
    enabled: !!clubId,
  });
}

/**
 * Create club
 */
export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation<Club, Error, Partial<Club>>({
    mutationFn: async (clubData) => {
      const { data } = await apiClient.post("/sa/clubs", clubData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
    },
  });
}

/**
 * Update club
 */
export function useUpdateClub() {
  const queryClient = useQueryClient();

  return useMutation<
    Club,
    Error,
    { clubId: string } & Partial<Club>
  >({
    mutationFn: async ({ clubId, ...updateData }) => {
      const { data } = await apiClient.put(
        `/sa/clubs/${clubId}`,
        updateData
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.detail(variables.clubId ?? ""),
      });
    },
  });
}

/**
 * Delete club
 */
export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (clubId) => {
      const { data } = await apiClient.delete(
        `/sa/clubs/${clubId ?? ""}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
    },
  });
}

/**
 * Assign user to club
 */
export function useAssignUserToClub() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AssignUserPayload>({
    mutationFn: async ({ clubId, userId, role = "MEMBER" }) => {
      const { data } = await apiClient.post(
        `/sa/clubs/${clubId}/members`,
        { userId, role }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.detail(variables.clubId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.all,
      });
    },
  });
}

/**
 * Remove user from club
 */
export function useRemoveUserFromClub() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { clubId: string; userId: string }
  >({
    mutationFn: async ({ clubId, userId }) => {
      await apiClient.delete(
        `/sa/clubs/${clubId}/members/${userId}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.detail(variables.clubId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.all,
      });
    },
  });
}