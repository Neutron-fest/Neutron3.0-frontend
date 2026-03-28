import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

// Define types for judging data
interface Competition {
  id: string;
  name: string;
  [key: string]: any;
}

interface Round {
  id: string;
  name: string;
  [key: string]: any;
}

interface Participant {
  id: string;
  name: string;
  [key: string]: any;
}

interface Criteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  [key: string]: any;
}

interface LockRequest {
  id: string;
  status: string;
  [key: string]: any;
}

interface Team {
  id: string;
  name: string;
  [key: string]: any;
}

interface MarkTeamQualificationParams {
  roundId: string;
  teamId: string;
  status: string;
  notes?: string;
}

interface CreateJudgingCriteriaParams {
  roundId: string;
  name: string;
  weight: number;
  description?: string;
  maxScore: number;
}

interface CreateRoundParams {
  competitionId: string;
  name: string;
  teamIds: string[];
}

interface SubmitCriteriaScoreParams {
  roundId: string;
  teamId: string;
  criteriaId: string;
  score: number;
}

interface AddEvaluationNotesParams {
  roundId: string;
  teamId: string;
  notes: string;
}

interface SubmitFinalScoreParams {
  roundId: string;
  teamId: string;
}

interface ReviewLockRequestParams {
  requestId: string;
  status: string;
  reviewNotes?: string;
}

// Update all hooks with appropriate types
export function useMyJudgingCompetitions() {
  return useQuery<Competition[]>({
    queryKey: queryKeys.judging.myCompetitions(),
    queryFn: async () => {
      const { data } = await apiClient.get("/judging/my-competitions");
      return (
        data?.data?.competitions ||
        data?.competitions ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
  });
}

export function useCompetitionRounds(competitionId: string) {
  return useQuery<Round[]>({
    queryKey: queryKeys.judging.rounds(competitionId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/competitions/${competitionId}/rounds`,
      );
      return (
        data?.data?.rounds ||
        data?.rounds ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!competitionId,
  });
}

export function useRoundParticipants(roundId: string) {
  return useQuery<Participant[]>({
    queryKey: queryKeys.judging.participants(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/participants`,
      );
      return (
        data?.data?.participants ||
        data?.participants ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!roundId,
  });
}

export function useJudgingCriteria(roundId: string) {
  return useQuery<Criteria[]>({
    queryKey: queryKeys.judging.criteria(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/criteria`,
      );
      return (
        data?.data?.criteria ||
        data?.criteria ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!roundId,
  });
}

export function useMarkTeamQualification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: MarkTeamQualificationParams) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${params.roundId}/teams/${params.teamId}/qualification`,
        { status: params.status, notes: params.notes },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.participants(variables.roundId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.leaderboard(variables.roundId),
      });
    },
  });
}

export function useCreateJudgingCriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CreateJudgingCriteriaParams) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${params.roundId}/criteria`,
        params,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.criteria(variables.roundId),
      });
    },
  });
}

export function useCreateRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CreateRoundParams) => {
      const { data } = await apiClient.post(
        `/judging/admin/competitions/${params.competitionId}/rounds`,
        params,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.adminRounds(variables.competitionId),
      });
    },
  });
}

export function useSubmitCriteriaScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: SubmitCriteriaScoreParams) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${params.roundId}/teams/${params.teamId}/criteria/${params.criteriaId}/score`,
        { score: params.score },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.teamScoreDetails(
          variables.roundId,
          variables.teamId,
        ),
      });
    },
  });
}

export function useAddEvaluationNotes() {
  return useMutation({
    mutationFn: async (params: AddEvaluationNotesParams) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${params.roundId}/teams/${params.teamId}/notes`,
        { notes: params.notes },
      );
      return data;
    },
  });
}

export function useSubmitFinalScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: SubmitFinalScoreParams) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${params.roundId}/teams/${params.teamId}/submit`,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.participants(variables.roundId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.leaderboard(variables.roundId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.allScored(variables.roundId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.teamScoreDetails(
          variables.roundId,
          variables.teamId,
        ),
      });
    },
  });
}

export function useReviewLockRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: ReviewLockRequestParams) => {
      const { data } = await apiClient.post(
        `/judging/lock-requests/${params.requestId}/review`,
        params,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.pendingLockRequests(),
      });
    },
  });
}
