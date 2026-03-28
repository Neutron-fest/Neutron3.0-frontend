import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

type CampaignId = string | number;
type CampaignFilters = Record<string, unknown>;
type CampaignQueryOptions = Record<string, unknown>;
type CampaignPayload = {
  csvFile?: File | Blob;
  audienceQuery?: Record<string, unknown>;
  name?: string;
  subject?: string;
  templateHtml?: string;
  audienceType?: string;
  scheduledAt?: string | null;
  [key: string]: unknown;
};
type CampaignTemplatePreviewPayload = {
  templateHtml?: string;
  sampleData?: Record<string, unknown>;
};
type UpdateCampaignTemplatePayload = {
  campaignId: CampaignId;
  [key: string]: unknown;
};
type UpdateCampaignAudiencePayload = {
  campaignId: CampaignId;
  audienceType?: string;
  audienceQuery?: Record<string, unknown>;
  csvFile?: File | Blob;
};
type ScheduleCampaignPayload = {
  campaignId: CampaignId;
  scheduledAt: string | null;
};

const buildCampaignPayload = (payload: CampaignPayload = {}) => {
  const {
    csvFile,
    audienceQuery,
    name,
    subject,
    templateHtml,
    audienceType,
    scheduledAt,
  } = payload;

  if (audienceType === "CSV" && csvFile) {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("subject", subject || "");
    formData.append("templateHtml", templateHtml || "");
    formData.append("audienceType", audienceType || "CSV");
    formData.append("audienceQuery", JSON.stringify(audienceQuery || {}));

    if (scheduledAt) {
      formData.append("scheduledAt", scheduledAt);
    }

    formData.append("csvFile", csvFile);

    return formData;
  }

  return {
    name,
    subject,
    templateHtml,
    audienceType,
    audienceQuery: audienceQuery || {},
    scheduledAt: scheduledAt || null,
  };
};

export function useCampaignMetadata() {
  return useQuery({
    queryKey: queryKeys.campaigns.metadata(),
    queryFn: async () => {
      const { data } = await apiClient.get("/sa/campaigns/metadata");
      return data?.data || { allowedVariables: [], audienceTypes: [] };
    },
  });
}

export function useCampaigns(
  filters: CampaignFilters = {},
  queryOptions: CampaignQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get("/sa/campaigns", {
        params: filters,
      });
      return data?.data || { campaigns: [], pagination: null };
    },
    ...queryOptions,
  });
}

export function useCampaignDetail(
  campaignId: CampaignId,
  queryOptions: CampaignQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(campaignId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/sa/campaigns/${campaignId}`);
      return data?.data;
    },
    enabled: !!campaignId,
    ...queryOptions,
  });
}

export function useCampaignRecipients(
  campaignId: CampaignId,
  filters: CampaignFilters = {},
  queryOptions: CampaignQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.campaigns.recipients(campaignId, filters),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/sa/campaigns/${campaignId}/recipients`,
        {
          params: filters,
        },
      );
      return data?.data || { recipients: [], pagination: null };
    },
    enabled: !!campaignId,
    ...queryOptions,
  });
}

export function usePreviewCampaignTemplate() {
  return useMutation({
    mutationFn: async ({
      templateHtml,
      sampleData,
    }: CampaignTemplatePreviewPayload) => {
      const { data } = await apiClient.post("/sa/campaigns/preview", {
        templateHtml,
        sampleData,
      });
      return data?.data?.preview;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CampaignPayload) => {
      const body = buildCampaignPayload(payload);
      const { data } = await apiClient.post("/sa/campaigns", body);
      return data?.data?.campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
}

export function useUpdateCampaignTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      ...payload
    }: UpdateCampaignTemplatePayload) => {
      const { data } = await apiClient.patch(`/sa/campaigns/${campaignId}`, {
        ...payload,
      });
      return data?.data?.campaign;
    },
    onSuccess: (_, variables: UpdateCampaignTemplatePayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId),
      });
    },
  });
}

export function useUpdateCampaignAudience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      audienceType,
      audienceQuery,
      csvFile,
    }: UpdateCampaignAudiencePayload) => {
      const body =
        audienceType === "CSV" && csvFile
          ? (() => {
              const formData = new FormData();
              formData.append("audienceType", audienceType);
              formData.append(
                "audienceQuery",
                JSON.stringify(audienceQuery || {}),
              );
              formData.append("csvFile", csvFile);
              return formData;
            })()
          : {
              audienceType,
              audienceQuery: audienceQuery || {},
            };

      const { data } = await apiClient.patch(
        `/sa/campaigns/${campaignId}/audience`,
        body,
      );

      return data?.data;
    },
    onSuccess: (_, variables: UpdateCampaignAudiencePayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(variables.campaignId),
      });
    },
  });
}

export function useScheduleCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      scheduledAt,
    }: ScheduleCampaignPayload) => {
      const { data } = await apiClient.post(
        `/sa/campaigns/${campaignId}/schedule`,
        {
          scheduledAt,
        },
      );
      return data?.data;
    },
    onSuccess: (_, variables: ScheduleCampaignPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId),
      });
    },
  });
}

export function useSendCampaignNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: CampaignId) => {
      const { data } = await apiClient.post(`/sa/campaigns/${campaignId}/send`);
      return data?.data;
    },
    onSuccess: (_, campaignId: CampaignId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(campaignId),
      });
    },
  });
}

export function useRetryFailedCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: CampaignId) => {
      const { data } = await apiClient.post(
        `/sa/campaigns/${campaignId}/retry-failed`,
      );
      return data?.data;
    },
    onSuccess: (_, campaignId: CampaignId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(campaignId),
      });
    },
  });
}

export function useRerunCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: CampaignId) => {
      const { data } = await apiClient.post(
        `/sa/campaigns/${campaignId}/rerun`,
      );
      return data?.data;
    },
    onSuccess: (_, campaignId: CampaignId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(campaignId),
      });
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: CampaignId) => {
      const { data } = await apiClient.post(
        `/sa/campaigns/${campaignId}/cancel`,
      );
      return data?.data;
    },
    onSuccess: (_, campaignId: CampaignId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(campaignId),
      });
    },
  });
}
