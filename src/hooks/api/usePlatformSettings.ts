import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

/* ================= TYPES ================= */

type PlatformSettings = {
  frozen?: boolean;
  registrationsPaused?: boolean;
  [key: string]: any;
};

type EmailTemplate = {
  key: string;
  subject: string;
  html: string;
  [key: string]: any;
};

type ApiResponse<T> = {
  data?: T;
  templates?: T[];
  template?: T;
};

type MutationResponse = any;

/* ================= QUERIES ================= */

export function usePlatformSettingsSummary() {
  return useQuery<PlatformSettings>({
    queryKey: queryKeys.settings.system(),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PlatformSettings>>(
        "/sa/platform-settings"
      );
      return data?.data || {};
    },
  });
}

export function useEmailTemplates() {
  return useQuery<EmailTemplate[]>({
    queryKey: [...queryKeys.settings.all, "email-templates"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<EmailTemplate>>(
        "/sa/platform-settings/email-templates"
      );
      return data?.data?.templates || [];
    },
  });
}

export function useEmailTemplate(templateKey?: string) {
  return useQuery<EmailTemplate | null>({
    queryKey: [...queryKeys.settings.all, "email-templates", templateKey],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<EmailTemplate>>(
        `/sa/platform-settings/email-templates/${templateKey}`
      );
      return data?.data?.template || null;
    },
    enabled: !!templateKey,
  });
}

/* ================= MUTATIONS ================= */

export function useFreezeAllChanges() {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, boolean>({
    mutationFn: async (frozen) => {
      const { data } = await apiClient.patch(
        "/sa/platform-settings/freeze",
        { frozen }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitions.all });
    },
  });
}

export function usePauseAllRegistrations() {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, boolean>({
    mutationFn: async (paused) => {
      const { data } = await apiClient.patch(
        "/sa/platform-settings/registrations",
        { paused }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.registrations.all });
    },
  });
}

export function useTriggerDbBackup() {
  return useMutation<unknown>({
    mutationFn: async () => {
      const { data } = await apiClient.post(
        "/sa/platform-settings/backup"
      );
      return data?.data;
    },
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation<
    EmailTemplate,
    Error,
    { templateKey: string; subject: string; html: string }
  >({
    mutationFn: async ({ templateKey, subject, html }) => {
      const { data } = await apiClient.put<ApiResponse<EmailTemplate>>(
        `/sa/platform-settings/email-templates/${templateKey}`,
        { subject, html }
      );
      return data?.data?.template as EmailTemplate;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.settings.all,
          "email-templates",
          variables.templateKey,
        ],
      });
    },
  });
}

export function useResetEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation<EmailTemplate, Error, string>({
    mutationFn: async (templateKey) => {
      const { data } = await apiClient.delete<ApiResponse<EmailTemplate>>(
        `/sa/platform-settings/email-templates/${templateKey}`
      );
      return data?.data?.template as EmailTemplate;
    },
    onSuccess: (_, templateKey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.settings.all, "email-templates", templateKey],
      });
    },
  });
}