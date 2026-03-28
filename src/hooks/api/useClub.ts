import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/**
 * Types
 */

export interface Club {
  _id: string;
  name: string;
  [key: string]: any;
}

export interface ClubMember {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface Competition {
  _id: string;
  title: string;
  [key: string]: any;
}

export interface Registration {
  _id: string;
  userId: string;
  [key: string]: any;
}

export interface FormResponse {
  _id: string;
  responses: Record<string, any>;
  [key: string]: any;
}

export interface ProposalResponse {
  proposals: any[];
  pagination: any;
}

/**
 * Helper
 */
const unwrap = <T>(data: any): T => data?.data ?? data;

/**
 * My Clubs
 */
export function useMyClubs() {
  return useQuery<Club[]>({
    queryKey: queryKeys.club.myClubs(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/club/my-clubs");
      return unwrap<{ clubs: Club[] }>(data)?.clubs || [];
    },
  });
}

/**
 * Club Dashboard
 */
export function useClubDashboard() {
  return useQuery<Record<string, any>>({
    queryKey: queryKeys.club.dashboard(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/club/dashboard");
      return unwrap<Record<string, any>>(data) || {};
    },
  });
}

/**
 * Club Members
 */
export function useClubMembers(clubId?: string) {
  return useQuery<ClubMember[]>({
    queryKey: queryKeys.club.members(clubId ?? ""),
    enabled: !!clubId,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/club/my-clubs/${clubId ?? ""}/members`
      );
      return unwrap<{ members: ClubMember[] }>(data)?.members || [];
    },
  });
}

/**
 * Club Competitions
 */
export function useClubCompetitions() {
  return useQuery<Competition[]>({
    queryKey: queryKeys.club.competitions(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/club/competitions");
      return unwrap<{ competitions: Competition[] }>(data)?.competitions || [];
    },
  });
}

/**
 * Competition Detail
 */
export function useClubCompetitionDetail(competitionId?: string) {
  return useQuery<Competition | null>({
    queryKey: queryKeys.club.competitionDetail(competitionId ?? ""),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/club/competitions/${competitionId ?? ""}`
      );
      return unwrap<{ competition: Competition }>(data)?.competition || null;
    },
  });
}

/**
 * Competition Registrations
 */
export function useClubCompetitionRegistrations(competitionId?: string) {
  return useQuery<Registration[]>({
    queryKey: queryKeys.club.competitionRegistrations(competitionId ?? ""),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/club/competitions/${competitionId ?? ""}/registrations`
      );
      return unwrap<{ registrations: Registration[] }>(data)?.registrations || [];
    },
  });
}

/**
 * Competition Form Responses
 */
export function useClubCompetitionFormResponses(competitionId?: string) {
  return useQuery<FormResponse[]>({
    queryKey: queryKeys.club.competitionFormResponses(competitionId ?? ""),
    enabled: !!competitionId,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/club/competitions/${competitionId ?? ""}/form-responses`
      );
      return unwrap<{ responses: FormResponse[] }>(data)?.responses || [];
    },
  });
}

/**
 * My Proposals
 */
export function useMyClubProposals(filters: Record<string, any> = {}) {
  return useQuery<ProposalResponse>({
    queryKey: queryKeys.club.proposals.mine(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/club/proposals/my",
        { params: filters }
      );
      return unwrap<ProposalResponse>(data) || {
        proposals: [],
        pagination: null,
      };
    },
  });
}

/**
 * Submit Competition Edit Proposal
 */
export function useSubmitCompetitionEditProposal() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    {
      competitionId: string;
      payload: Record<string, any>;
      summary: string;
      changeDescription: string;
    }
  >({
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
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.competitionDetail(
          variables.competitionId ?? ""
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.club.proposals.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.all,
      });
    },
  });
}