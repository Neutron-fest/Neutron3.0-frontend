import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

type Id = string | number;
type FormEntry = Record<string, unknown>;
type UploadRegistrationImagePayload = {
  competitionId: Id;
  formId: Id;
  fieldName: string;
  file: File | Blob;
};
type SoloRegistrationPayload = { competitionId: Id; formData?: FormEntry[] };
type TeamRegistrationPayload = {
  competitionId: Id;
  teamName: string;
  formData?: FormEntry[];
};
type SendTeamInvitePayload = { teamId: Id; invitedEmail: string };
type SubmitTeamMemberFormPayload = { teamId: Id; formData?: FormEntry[] };
type TransferLeadershipPayload = { teamId: Id; newLeaderId: Id };
type RemoveTeamMemberPayload = { teamId: Id; memberId: Id };
type RemovePendingInvitePayload = { teamId: Id; inviteId: Id };

export function usePublicCompetitionFormFields(competitionId: Id) {
  return useQuery({
    queryKey: ["public", "competition-form-fields", competitionId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/registration/competition/${competitionId}/form-fields`,
      );

      const payload = data?.data;
      if (Array.isArray(payload)) {
        return { formId: null, fields: payload };
      }

      return {
        formId: payload?.formId || null,
        fields: Array.isArray(payload?.fields) ? payload.fields : [],
      };
    },
    enabled: !!competitionId,
  });
}

export function useUploadRegistrationImage() {
  return useMutation({
    mutationFn: async ({
      competitionId,
      formId,
      fieldName,
      file,
    }: UploadRegistrationImagePayload) => {
      const body = new FormData();
      body.append("image", file);
      body.append("fieldName", fieldName);

      const { data } = await apiClient.post(
        `/registration/competition/${competitionId}/form/${formId}/upload-image`,
        body,
      );

      return data?.data;
    },
  });
}

export function useRegisterSoloCompetition() {
  return useMutation({
    mutationFn: async ({
      competitionId,
      formData = [],
    }: SoloRegistrationPayload) => {
      const { data } = await apiClient.post("/registration/solo", {
        competitionId,
        formData,
      });

      return data?.data || data;
    },
  });
}

export function useRegisterTeamCompetition() {
  return useMutation({
    mutationFn: async ({
      competitionId,
      teamName,
      formData = [],
    }: TeamRegistrationPayload) => {
      const { data } = await apiClient.post("/registration/team", {
        competitionId,
        teamName,
        formData,
      });

      return data?.data || data;
    },
  });
}

export function useMyRegistrations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.publicRegistrations.my(),
    queryFn: async () => {
      const { data } = await apiClient.get("/registration/my");
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled,
  });
}

export function useSendTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, invitedEmail }: SendTeamInvitePayload) => {
      const { data } = await apiClient.post("/registration/team/invite", {
        teamId,
        invitedEmail,
      });

      return data?.data || data;
    },
    onSuccess: (_, variables: SendTeamInvitePayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });

      if (variables?.teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(variables.teamId),
        });
      }
    },
  });
}

export function useAcceptTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteToken: string) => {
      const { data } = await apiClient.post(
        `/registration/team/invite/${inviteToken}/accept`,
      );

      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });
    },
  });
}

export function useDeclineTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteToken: string) => {
      const { data } = await apiClient.post(
        `/registration/team/invite/${inviteToken}/decline`,
      );

      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });
    },
  });
}

export function useTeamInvitePreview(inviteToken: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.publicRegistrations.invitePreview(inviteToken),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/registration/team/invite/${inviteToken}`,
      );

      return data?.data || data;
    },
    enabled: Boolean(inviteToken) && enabled,
    retry: false,
  });
}

export function useSubmitTeamMemberForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      formData = [],
    }: SubmitTeamMemberFormPayload) => {
      const { data } = await apiClient.post(
        `/registration/team/${teamId}/member-form`,
        { formData },
      );

      return data?.data || data;
    },
    onSuccess: (_, variables: SubmitTeamMemberFormPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });

      if (variables?.teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(variables.teamId),
        });
      }
    },
  });
}

export function usePendingTeamInvites(enabled = true) {
  return useQuery({
    queryKey: queryKeys.publicRegistrations.pendingInvites(),
    queryFn: async () => {
      const { data } = await apiClient.get("/registration/my/pending-invites");
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled,
  });
}

export function useTeamDetails(teamId: Id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.publicRegistrations.team(teamId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/registration/team/${teamId}`);
      return data?.data || data;
    },
    enabled: Boolean(teamId) && enabled,
  });
}

export function useTransferTeamLeadership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, newLeaderId }: TransferLeadershipPayload) => {
      const { data } = await apiClient.post(
        `/registration/team/transfer-leadership`,
        {
          teamId,
          newLeaderId,
        },
      );
      return data?.data || data;
    },
    onSuccess: (_, variables: TransferLeadershipPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });

      if (variables?.teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(variables.teamId),
        });
      }
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, memberId }: RemoveTeamMemberPayload) => {
      const { data } = await apiClient.delete(
        `/registration/team/${teamId}/member/${memberId}`,
      );
      return data?.data || data;
    },
    onSuccess: (_, variables: RemoveTeamMemberPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });

      if (variables?.teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(variables.teamId),
        });
      }
    },
  });
}

export function useRemovePendingTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, inviteId }: RemovePendingInvitePayload) => {
      const { data } = await apiClient.delete(
        `/registration/team/${teamId}/invite/${inviteId}`,
      );
      return data?.data || data;
    },
    onSuccess: (_, variables: RemovePendingInvitePayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });

      if (variables?.teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(variables.teamId),
        });
      }
    },
  });
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: Id) => {
      const { data } = await apiClient.delete(
        `/registration/team/${teamId}/leave`,
      );
      return data?.data || data;
    },
    onSuccess: (_, teamId: Id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.my(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicRegistrations.pendingInvites(),
      });

      if (teamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.publicRegistrations.team(teamId),
        });
      }
    },
  });
}
