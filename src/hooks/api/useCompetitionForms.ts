import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { queryKeys } from "@/src/lib/queryKeys";

type Id = string | number;
type GenericPayload = Record<string, unknown>;
type UpdateFormPayload = { formId: Id } & GenericPayload;
type UpdateFormFieldPayload = { formId: Id; fieldId: Id } & GenericPayload;
type DeleteFormFieldPayload = { formId: Id; fieldId: Id };
type ReorderFormFieldsPayload = {
  formId: Id;
  fieldIds: Array<string | number>;
};

const normalizeList = (data: any) =>
  data?.data?.forms ||
  data?.forms ||
  (Array.isArray(data?.data) ? data.data : null) ||
  (Array.isArray(data) ? data : []);

const normalizeOne = (data: any) => data?.data || data || null;

export function useCompetitionForms() {
  return useQuery({
    queryKey: queryKeys.forms.list(),
    queryFn: async () => {
      const { data } = await apiClient.get("/forms");
      return normalizeList(data);
    },
  });
}

export function useCompetitionForm(formId: Id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.forms.detail(formId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/forms/${formId}`);
      return normalizeOne(data);
    },
    enabled: !!formId && enabled,
  });
}

export function useCreateCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GenericPayload) => {
      const { data } = await apiClient.post("/forms", payload);
      return normalizeOne(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitions.all });
    },
  });
}

export function useUpdateCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, ...payload }: UpdateFormPayload) => {
      const { data } = await apiClient.put(`/forms/${formId}`, payload);
      return normalizeOne(data);
    },
    onSuccess: (_, variables: UpdateFormPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

export function useDeleteCompetitionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formId: Id) => {
      const { data } = await apiClient.delete(`/forms/${formId}`);
      return normalizeOne(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.competitions.all });
    },
  });
}

export function useCreateCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, ...payload }: UpdateFormPayload) => {
      const { data } = await apiClient.post(`/forms/${formId}/fields`, payload);
      return normalizeOne(data);
    },
    onSuccess: (_, variables: UpdateFormPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

export function useUpdateCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
      fieldId,
      ...payload
    }: UpdateFormFieldPayload) => {
      const { data } = await apiClient.put(
        `/forms/${formId}/fields/${fieldId}`,
        payload,
      );
      return normalizeOne(data);
    },
    onSuccess: (_, variables: UpdateFormFieldPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

export function useDeleteCompetitionFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, fieldId }: DeleteFormFieldPayload) => {
      const { data } = await apiClient.delete(
        `/forms/${formId}/fields/${fieldId}`,
      );
      return normalizeOne(data);
    },
    onSuccess: (_, variables: DeleteFormFieldPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}

export function useReorderCompetitionFormFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, fieldIds }: ReorderFormFieldsPayload) => {
      const { data } = await apiClient.patch(
        `/forms/${formId}/fields/reorder`,
        {
          fieldIds,
        },
      );
      return normalizeOne(data);
    },
    onSuccess: (_, variables: ReorderFormFieldsPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forms.detail(variables.formId),
      });
    },
  });
}
