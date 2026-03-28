import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

type Id = string | number;
type QualificationPayload = {
  roundId: Id;
  teamId: Id;
  status: string;
  notes?: string;
};
type CreateCriteriaPayload = {
  roundId: Id;
  name: string;
  weight: number;
  description?: string;
  maxScore: number;
};
type CreateRoundPayload = { competitionId: Id; name: string; teamIds: Id[] };
type SubmitCriteriaScorePayload = {
  roundId: Id;
  teamId: Id;
  criteriaId: Id;
  score: number;
};
type AddNotesPayload = { roundId: Id; teamId: Id; notes: string };
type SubmitFinalScorePayload = { roundId: Id; teamId: Id };
type ReviewLockRequestPayload = {
  requestId: Id;
  status: string;
  reviewNotes?: string;
};

/**
 * Competitions assigned to DH as a judge
 * GET /api/v1/judging/my-competitions
 */
export function useMyJudgingCompetitions() {
  return useQuery({
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

/**
 * All rounds for a competition
 * GET /api/v1/judging/competitions/:competitionId/rounds
 */
export function useCompetitionRounds(competitionId: Id) {
  return useQuery({
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

/**
 * Participants for a round
 * GET /api/v1/judging/rounds/:roundId/participants
 */
export function useRoundParticipants(roundId: Id) {
  return useQuery({
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

/**
 * Judging criteria for a round
 * GET /api/v1/judging/rounds/:roundId/criteria
 */
export function useJudgingCriteria(roundId: Id) {
  return useQuery({
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

/**
 * Judges who haven't submitted scores yet (Head Judge / DH)
 * GET /api/v1/judging/rounds/:roundId/pending-judges
 */
export function usePendingJudges(roundId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.pendingJudges(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/pending-judges`,
      );
      return (
        data?.data?.judges ||
        data?.judges ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!roundId,
  });
}

/**
 * Leaderboard for a round
 * GET /api/v1/judging/rounds/:roundId/leaderboard
 */
export function useRoundLeaderboard(roundId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.leaderboard(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/leaderboard`,
      );
      return (
        data?.data?.leaderboard ||
        data?.leaderboard ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!roundId,
  });
}

/**
 * Whether all judges have submitted scores for a round
 * GET /api/v1/judging/rounds/:roundId/all-scored
 */
export function useAllScored(roundId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.allScored(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/all-scored`,
      );
      return data?.data?.allScored ?? data?.allScored ?? false;
    },
    enabled: !!roundId,
  });
}

/**
 * Mark a team as qualified/eliminated (Head Judge / DH)
 * POST /api/v1/judging/rounds/:roundId/teams/:teamId/qualification
 */
export function useMarkTeamQualification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roundId,
      teamId,
      status,
      notes,
    }: QualificationPayload) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/teams/${teamId}/qualification`,
        { status, notes },
      );
      return data;
    },
    onSuccess: (_, variables: QualificationPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.participants(variables.roundId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.leaderboard(variables.roundId),
      });
    },
  });
}

/**
 * Send lock request to SA for a round (Head Judge / DH)
 * POST /api/v1/judging/rounds/:roundId/lock-request
 */
export function useSendLockRequest() {
  return useMutation({
    mutationFn: async (roundId: Id) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/lock-request`,
      );
      return data;
    },
  });
}

/**
 * Create judging criteria for a round (Head Judge / DH)
 * POST /api/v1/judging/rounds/:roundId/criteria
 */
export function useCreateJudgingCriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roundId,
      name,
      weight,
      description,
      maxScore,
    }: CreateCriteriaPayload) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/criteria`,
        { name, weight, description, maxScore },
      );
      return data;
    },
    onSuccess: (_, variables: CreateCriteriaPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.criteria(variables.roundId),
      });
    },
  });
}

/**
 * Admin: All rounds for a competition (no judge-assignment check)
 * GET /api/v1/judging/admin/competitions/:competitionId/rounds
 */
export function useAdminCompetitionRounds(competitionId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.adminRounds(competitionId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/admin/competitions/${competitionId}/rounds`,
      );
      return (
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!competitionId,
  });
}

/**
 * Admin: Approved teams for a competition with prevRoundStatus
 * GET /api/v1/judging/admin/competitions/:competitionId/teams
 */
export function useAdminCompetitionTeams(competitionId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.adminTeams(competitionId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/admin/competitions/${competitionId}/teams`,
      );
      return (
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!competitionId,
  });
}

/**
 * Admin: All teams in a round with scores and qualification status
 * GET /api/v1/judging/admin/rounds/:roundId/teams
 */
export function useAdminRoundTeams(roundId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.adminRoundTeams(roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/admin/rounds/${roundId}/teams`,
      );
      return data?.data || data || null;
    },
    enabled: !!roundId,
  });
}

/**
 * Admin: Create a new round for a competition
 * POST /api/v1/judging/admin/competitions/:competitionId/rounds
 */
export function useCreateRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      competitionId,
      name,
      teamIds,
    }: CreateRoundPayload) => {
      const { data } = await apiClient.post(
        `/judging/admin/competitions/${competitionId}/rounds`,
        { name, teamIds },
      );
      return data;
    },
    onSuccess: (_, variables: CreateRoundPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.adminRounds(variables.competitionId),
      });
    },
  });
}

/* ======================
   JUDGE SCORING HOOKS
====================== */

/**
 * Score details for a team by the current judge (pre-fills scoring form)
 * GET /api/v1/judging/rounds/:roundId/teams/:teamId/score-details
 */
export function useTeamScoreDetails(roundId: Id, teamId: Id) {
  return useQuery({
    queryKey: queryKeys.judging.teamScoreDetails(roundId, teamId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/judging/rounds/${roundId}/teams/${teamId}/score-details`,
      );
      return data?.data || data || null;
    },
    enabled: !!roundId && !!teamId,
  });
}

/**
 * Submit a score for one criterion
 * POST /api/v1/judging/rounds/:roundId/teams/:teamId/criteria/:criteriaId/score
 */
export function useSubmitCriteriaScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roundId,
      teamId,
      criteriaId,
      score,
    }: SubmitCriteriaScorePayload) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/teams/${teamId}/criteria/${criteriaId}/score`,
        { score },
      );
      return data;
    },
    onSuccess: (_, variables: SubmitCriteriaScorePayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.judging.teamScoreDetails(
          variables.roundId,
          variables.teamId,
        ),
      });
    },
  });
}

/**
 * Add evaluation notes for a team
 * POST /api/v1/judging/rounds/:roundId/teams/:teamId/notes
 */
export function useAddEvaluationNotes() {
  return useMutation({
    mutationFn: async ({ roundId, teamId, notes }: AddNotesPayload) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/teams/${teamId}/notes`,
        { notes },
      );
      return data;
    },
  });
}

/**
 * Submit final score (auto weighted total) for a team
 * POST /api/v1/judging/rounds/:roundId/teams/:teamId/submit
 */
export function useSubmitFinalScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roundId, teamId }: SubmitFinalScorePayload) => {
      const { data } = await apiClient.post(
        `/judging/rounds/${roundId}/teams/${teamId}/submit`,
      );
      return data;
    },
    onSuccess: (_, variables: SubmitFinalScorePayload) => {
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

/* ======================
   LOCK REQUEST APPROVAL (SA)
====================== */

/**
 * Pending lock requests awaiting SA approval
 * GET /api/v1/judging/lock-requests/pending
 */
export function usePendingLockRequests() {
  return useQuery({
    queryKey: queryKeys.judging.pendingLockRequests(),
    queryFn: async () => {
      const { data } = await apiClient.get("/judging/lock-requests/pending");
      return (
        data?.data?.requests ||
        data?.requests ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : [])
      );
    },
  });
}

/**
 * Approve or reject a lock request (SA only)
 * POST /api/v1/judging/lock-requests/:requestId/review
 */
export function useReviewLockRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      reviewNotes,
    }: ReviewLockRequestPayload) => {
      const { data } = await apiClient.post(
        `/judging/lock-requests/${requestId}/review`,
        { status, reviewNotes },
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
