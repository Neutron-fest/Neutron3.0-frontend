import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

/**
 * Types
 */

export interface FormField {
  _id: string;
  label: string;
  type: string;
  required?: boolean;
  order?: number;
  [key: string]: any;
}

export interface CompetitionForm {
  _id: string;
  title: string;
  fields?: FormField[];
  [key: string]: any;
}

export interface FormResponseMeta<T> {
  data: T;
  pendingApproval?: boolean;
  message?: string;
}

/**
 * Helpers
 */

const normalizeList = <T>(data: any): T[] =>
  data?.data?.forms ||
  data?.forms ||
  (Array.isArray(data?.data) ? data.data : []) ||
  (Array.isArray(data) ? data : []);

const normalizeOne = <T>(data: any): T | null =>
  data?.data || data || null;

/**
 * Get all forms
 */
export function useCompetitionForms(enabled: boolean = true) {
  return useQuery<CompetitionForm[]>({
    queryKey: queryKeys.forms.list(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/forms");
      return normalizeList<CompetitionForm>(data);
    },
    enabled,
  });
}

/**
 * Get single form
 */
export function useCompetitionForm(
  formId?: string,
  enabled: boolean = true
) {
  return useQuery<CompetitionForm | null>({
    queryKey: queryKeys.forms.detail(formId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`/forms/${formId ?? ""}`);
      return normalizeOne<CompetitionForm>(data);
    },
    enabled: !!formId && enabled,
  });
}

/**
 * Create form
 */
export function useCreateCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation<
    FormResponseMeta<CompetitionForm>,
    Error,
    Partial<CompetitionForm>
  >({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/forms", payload);
      const normalized = normalizeOne<CompetitionForm>(data);

      return {
        data: normalized as CompetitionForm,
        pendingApproval: Boolean(data?.pendingApproval),
        message: data?.message,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.competitions.all,
      });
    },
  });
}

/**
 * Update form
 */
export function useUpdateCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation<
    FormResponseMeta<CompetitionForm>,
    Error,
    { formId: string } & Partial<CompetitionForm>
  >({
    mutationFn: async ({ formId, ...payload }) => {
      const { data } = await apiClient.put(
        `/forms/${formId}`,
        payload
      );

      const normalized = normalizeOne<CompetitionForm>(data);

      return {
        data: normalized as CompetitionForm,
        pendingApproval: Boolean(data?.pendingApproval),
        message: data?.message,
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId ?? ""),
      });
    },
  });
}

/**
 * Delete form
 */
export function useDeleteCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation<
    FormResponseMeta<null>,
    Error,
    string
  >({
    mutationFn: async (formId) => {
      const { data } = await apiClient.delete(
        `/forms/${formId}`
      );

      const normalized = normalizeOne<any>(data);

      return {
        data: normalized,
        pendingApproval: Boolean(data?.pendingApproval),
        message: data?.message,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.competitions.all,
      });
    },
  });
}

/**
 * Create field
 */
export function useCreateCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation<
    FormField,
    Error,
    { formId: string } & Partial<FormField>
  >({
    mutationFn: async ({ formId, ...payload }) => {
      const { data } = await apiClient.post(
        `/forms/${formId}/fields`,
        payload
      );
      return normalizeOne<FormField>(data) as FormField;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId ?? ""),
      });
    },
  });
}

/**
 * Update field
 */
export function useUpdateCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation<
    FormField,
    Error,
    { formId: string; fieldId: string } & Partial<FormField>
  >({
    mutationFn: async ({ formId, fieldId, ...payload }) => {
      const { data } = await apiClient.put(
        `/forms/${formId}/fields/${fieldId}`,
        payload
      );
      return normalizeOne<FormField>(data) as FormField;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

/**
 * Delete field
 */
export function useDeleteCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    Error,
    { formId: string; fieldId: string }
  >({
    mutationFn: async ({ formId, fieldId }) => {
      const { data } = await apiClient.delete(
        `/forms/${formId}/fields/${fieldId}`
      );
      return normalizeOne<null>(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

/**
 * Reorder fields
 */
export function useReorderCompetitionFormFields() {
  const queryClient = useQueryClient();

  return useMutation<
    CompetitionForm,
    Error,
    { formId: string; fieldIds: string[] }
  >({
    mutationFn: async ({ formId, fieldIds }) => {
      const { data } = await apiClient.patch(
        `/forms/${formId}/fields/reorder`,
        { fieldIds }
      );
      return normalizeOne<CompetitionForm>(data) as CompetitionForm;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}