import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

/**
 * Types
 */

export type AudienceType = "CSV" | "QUERY";

export interface Campaign {
  _id: string;
  name: string;
  subject: string;
  templateHtml: string;
  audienceType: AudienceType;
  scheduledAt?: string | null;
  [key: string]: any;
}

export interface CampaignFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  pagination: Pagination | null;
}

export interface Recipient {
  _id: string;
  email: string;
  status?: string;
  [key: string]: any;
}

export interface RecipientsResponse {
  recipients: Recipient[];
  pagination: Pagination | null;
}

export interface CampaignMetadata {
  allowedVariables: string[];
  audienceTypes: AudienceType[];
}

export interface CampaignPayload {
  name?: string;
  subject?: string;
  templateHtml?: string;
  audienceType?: AudienceType;
  audienceQuery?: Record<string, any>;
  scheduledAt?: string | null;
  csvFile?: File;
}

/**
 * Helper: build payload
 */
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

/**
 * Metadata
 */
export function useCampaignMetadata() {
  return useQuery<CampaignMetadata>({
    queryKey: queryKeys.campaigns.metadata(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/sa/campaigns/metadata"
      );
      return data?.data || { allowedVariables: [], audienceTypes: [] };
    },
  });
}

/**
 * Campaign list
 */
export function useCampaigns(
  filters: CampaignFilters = {},
  queryOptions: any = {}
) {
  return useQuery<CampaignListResponse>({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/sa/campaigns", {
        params: filters,
      });
      return data?.data || { campaigns: [], pagination: null };
    },
    ...queryOptions,
  });
}

/**
 * Campaign detail
 */
export function useCampaignDetail(
  campaignId?: string,
  queryOptions: any = {}
) {
  return useQuery<Campaign | undefined>({
    queryKey: queryKeys.campaigns.detail(campaignId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/sa/campaigns/${campaignId}`
      );
      return data?.data;
    },
    enabled: !!campaignId,
    ...queryOptions,
  });
}

/**
 * Campaign recipients
 */
export function useCampaignRecipients(
  campaignId?: string,
  filters: CampaignFilters = {},
  queryOptions: any = {}
) {
  return useQuery<RecipientsResponse>({
    queryKey: queryKeys.campaigns.recipients(campaignId ?? "", filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/sa/campaigns/${campaignId ?? ""}/recipients`,
        { params: filters }
      );
      return data?.data || { recipients: [], pagination: null };
    },
    enabled: !!campaignId,
    ...queryOptions,
  });
}

/**
 * Preview template
 */
export function usePreviewCampaignTemplate() {
  return useMutation<
    string,
    Error,
    { templateHtml: string; sampleData: Record<string, any> }
  >({
    mutationFn: async ({ templateHtml, sampleData }) => {
      const { data } = await apiClient.post(
        "/sa/campaigns/preview",
        { templateHtml, sampleData }
      );
      return data?.data?.preview;
    },
  });
}

/**
 * Create campaign
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation<Campaign, Error, CampaignPayload>({
    mutationFn: async (payload) => {
      const body = buildCampaignPayload(payload);
      const { data } = await apiClient.post("/sa/campaigns", body);
      return data?.data?.campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
}

/**
 * Update template
 */
export function useUpdateCampaignTemplate() {
  const queryClient = useQueryClient();

  return useMutation<
    Campaign,
    Error,
    { campaignId: string } & Partial<CampaignPayload>
  >({
    mutationFn: async ({ campaignId, ...payload }) => {
      const { data } = await apiClient.patch(
        `/sa/campaigns/${campaignId ?? ""}`,
        payload
      );
      return data?.data?.campaign;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId ?? ""),
      });
    },
  });
}

/**
 * Update audience
 */
export function useUpdateCampaignAudience() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    {
      campaignId: string;
      audienceType: AudienceType;
      audienceQuery?: Record<string, any>;
      csvFile?: File;
    }
  >({
    mutationFn: async ({
      campaignId,
      audienceType,
      audienceQuery,
      csvFile,
    }) => {
      const body =
        audienceType === "CSV" && csvFile
          ? (() => {
              const formData = new FormData();
              formData.append("audienceType", audienceType);
              formData.append(
                "audienceQuery",
                JSON.stringify(audienceQuery || {})
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
        body
      );

      return data?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.recipients(variables.campaignId ?? ""),
      });
    },
  });
}

/**
 * Schedule campaign
 */
export function useScheduleCampaign() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { campaignId: string; scheduledAt: string }
  >({
    mutationFn: async ({ campaignId, scheduledAt }) => {
      const { data } = await apiClient.post(
        `/sa/campaigns/${campaignId}/schedule`,
        { scheduledAt }
      );
      return data?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(variables.campaignId),
      });
    },
  });
}

/**
 * Actions (send, retry, rerun, cancel)
 */

const createCampaignAction = (endpoint: string) => {
  return function () {
    const queryClient = useQueryClient();

    return useMutation<any, Error, string>({
      mutationFn: async (campaignId) => {
        const { data } = await apiClient.post(
          `/sa/campaigns/${campaignId}/${endpoint}`
        );
        return data?.data;
      },
      onSuccess: (_, campaignId) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.detail(campaignId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.recipients(campaignId),
        });
      },
    });
  };
};

export const useSendCampaignNow = createCampaignAction("send");
export const useRetryFailedCampaign = createCampaignAction("retry-failed");
export const useRerunCampaign = createCampaignAction("rerun");
export const useCancelCampaign = createCampaignAction("cancel");