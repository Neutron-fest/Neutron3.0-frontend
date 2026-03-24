import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

const unwrap = (data) => data?.data ?? data;

export function useMyClubs() {
  return useQuery({
    queryKey: queryKeys.club.myClubs(),
    queryFn: async () => {
      const { data } = await apiClient.get("/club/my-clubs");
      return unwrap(data)?.clubs || [];
    },
  });
}

export function useClubDashboard() {
  return useQuery({
    queryKey: queryKeys.club.dashboard(),
    queryFn: async () => {
      const { data } = await apiClient.get("/club/dashboard");
      return unwrap(data) || {};
    },
  });
}

export function useClubMembers(clubId) {
  return useQuery({
    queryKey: queryKeys.club.members(clubId),
    enabled: !!clubId,
    queryFn: async () => {
      const { data } = await apiClient.get(`/club/my-clubs/${clubId}/members`);
      return unwrap(data)?.members || [];
    },
  });
}

export function useClubCompetitions() {
  return useQuery({
    queryKey: queryKeys.club.competitions(),
    queryFn: async () => {
      const { data } = await apiClient.get("/club/competitions");
      return unwrap(data)?.competitions || [];
    },
  });
}

export function useClubCompetitionDetail(competitionId) {
  return useQuery({
    queryKey: queryKeys.club.competitionDetail(competitionId),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/club/competitions/${competitionId}`,
      );
      return unwrap(data)?.competition || null;
    },
  });
}

export function useClubCompetitionRegistrations(competitionId) {
  return useQuery({
    queryKey: queryKeys.club.competitionRegistrations(competitionId),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/club/competitions/${competitionId}/registrations`,
      );
      return unwrap(data)?.registrations || [];
    },
  });
}

export function useClubCompetitionFormResponses(competitionId) {
  return useQuery({
    queryKey: queryKeys.club.competitionFormResponses(competitionId),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/club/competitions/${competitionId}/form-responses`,
      );
      return unwrap(data)?.responses || [];
    },
  });
}

export function useMyClubProposals(filters = {}) {
  return useQuery({
    queryKey: queryKeys.club.proposals.mine(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/club/proposals/my", {
        params: filters,
      });
      return unwrap(data) || { proposals: [], pagination: null };
    },
  });
}

export function useSubmitCompetitionEditProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      competitionId,
      payload,
      summary,
      changeDescription,
    }) => {
      const { data } = await apiClient.post(
        `/club/competitions/${competitionId}/proposals`,
        {
          payload,
          summary,
          changeDescription,
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.competitionDetail(variables.competitionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.proposals.all(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}
