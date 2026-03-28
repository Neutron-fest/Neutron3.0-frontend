/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query cache
 */

type QueryKey = readonly unknown[];

export const queryKeys = {
  // Auth queries
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // User queries
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
  },

  // Public profile queries
  publicProfiles: {
    all: ["public-profiles"] as const,
    details: () => [...queryKeys.publicProfiles.all, "detail"] as const,
    detail: (userId: string | number) =>
      [...queryKeys.publicProfiles.details(), userId] as const,
  },

  // Public registration + team management queries
  publicRegistrations: {
    all: ["public-registrations"] as const,
    my: () => [...queryKeys.publicRegistrations.all, "my"] as const,
    invitePreview: (inviteToken: string) =>
      [
        ...queryKeys.publicRegistrations.all,
        "invite-preview",
        inviteToken,
      ] as const,
    pendingInvites: () =>
      [...queryKeys.publicRegistrations.all, "pending-invites"] as const,
    teams: () => [...queryKeys.publicRegistrations.all, "teams"] as const,
    team: (teamId: string | number) =>
      [...queryKeys.publicRegistrations.teams(), teamId] as const,
  },

  // Department queries
  departments: {
    all: ["departments"] as const,
    lists: () => [...queryKeys.departments.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.departments.lists(), filters] as const,
    details: () => [...queryKeys.departments.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.departments.details(), id] as const,
  },

  // Approval queries
  approvals: {
    all: ["approvals"] as const,
    lists: () => [...queryKeys.approvals.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.approvals.lists(), filters] as const,
    details: () => [...queryKeys.approvals.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.approvals.details(), id] as const,
    pending: () => [...queryKeys.approvals.all, "pending"] as const,
  },

  // Issues queries
  issues: {
    all: ["issues"] as const,
    lists: () => [...queryKeys.issues.all, "list"] as const,
    list: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.issues.lists(), filters] as const,
  },

  // Registration queries
  registrations: {
    all: ["registrations"] as const,
    pending: (filters: Record<string, unknown> = {}) =>
      [...queryKeys.registrations.all, "pending", filters] as const,
  },

  // Competition queries
  competitions: {
    all: ["competitions"] as const,
    lists: () => [...queryKeys.competitions.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.competitions.lists(), filters] as const,
    details: () => [...queryKeys.competitions.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.competitions.details(), id] as const,
    judges: (id: string | number) =>
      [...queryKeys.competitions.all, "judges", id] as const,
    volunteers: (id: string | number) =>
      [...queryKeys.competitions.all, "volunteers", id] as const,
  },

  // Forms queries
  forms: {
    all: ["forms"] as const,
    lists: () => [...queryKeys.forms.all, "list"] as const,
    list: () => [...queryKeys.forms.lists()] as const,
    details: () => [...queryKeys.forms.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.forms.details(), id] as const,
  },

  // Judging queries
  judging: {
    all: ["judging"] as const,
    myCompetitions: () =>
      [...queryKeys.judging.all, "my-competitions"] as const,
    rounds: (competitionId: string | number) =>
      [...queryKeys.judging.all, "rounds", competitionId] as const,
    participants: (roundId: string | number) =>
      [...queryKeys.judging.all, "participants", roundId] as const,
    criteria: (roundId: string | number) =>
      [...queryKeys.judging.all, "criteria", roundId] as const,
    leaderboard: (roundId: string | number) =>
      [...queryKeys.judging.all, "leaderboard", roundId] as const,
    pendingJudges: (roundId: string | number) =>
      [...queryKeys.judging.all, "pending-judges", roundId] as const,
    allScored: (roundId: string | number) =>
      [...queryKeys.judging.all, "all-scored", roundId] as const,
    adminRounds: (competitionId: string | number) =>
      [...queryKeys.judging.all, "admin-rounds", competitionId] as const,
    adminTeams: (competitionId: string | number) =>
      [...queryKeys.judging.all, "admin-teams", competitionId] as const,
    adminRoundTeams: (roundId: string | number) =>
      [...queryKeys.judging.all, "admin-round-teams", roundId] as const,
    teamScoreDetails: (roundId: string | number, teamId: string | number) =>
      [
        ...queryKeys.judging.all,
        "team-score-details",
        roundId,
        teamId,
      ] as const,
    pendingLockRequests: () =>
      [...queryKeys.judging.all, "pending-lock-requests"] as const,
  },

  // Attendance queries
  attendance: {
    all: ["attendance"] as const,
    festStats: () => [...queryKeys.attendance.all, "fest-stats"] as const,
    volunteerProfile: () =>
      [...queryKeys.attendance.all, "volunteer-profile"] as const,
    registrationDeskVolunteers: () =>
      [...queryKeys.attendance.all, "registration-desk-volunteers"] as const,
    competitionStats: (id: string | number) =>
      [...queryKeys.attendance.all, "competition-stats", id] as const,
    participants: (query: Record<string, unknown>) =>
      [...queryKeys.attendance.all, "participants", query] as const,
    participant: (id: string | number) =>
      [...queryKeys.attendance.all, "participant", id] as const,
  },

  // Settings queries
  settings: {
    all: ["settings"] as const,
    system: () => [...queryKeys.settings.all, "system"] as const,
  },

  // Campaign queries
  campaigns: {
    all: ["campaigns"] as const,
    metadata: () => [...queryKeys.campaigns.all, "metadata"] as const,
    lists: () => [...queryKeys.campaigns.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.campaigns.lists(), filters] as const,
    details: () => [...queryKeys.campaigns.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.campaigns.details(), id] as const,
    recipients: (id: string | number, filters: Record<string, unknown> = {}) =>
      [...queryKeys.campaigns.all, "recipients", id, filters] as const,
  },
};
