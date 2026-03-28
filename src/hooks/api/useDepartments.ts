import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/* ================= TYPES ================= */

type Department = {
  id: string;
  name?: string;
  deptHeadIds?: string[];
  deptHeadId?: string;
  deptHeads?: any[];
  deptHead?: any;
  members?: any[];
  membersCount?: number;
  memberCount?: number;
  members_count?: number;
  [key: string]: any;
};

type ApiResponse<T> = {
  data?: {
    departments?: T[];
    department?: T;
  };
  departments?: T[];
  department?: T;
};

type MutationResponse = any;

/* ================= HELPERS ================= */

const normalizeDepartment = (dept: Department): Department => ({
  ...dept,
  deptHeadIds: Array.isArray(dept?.deptHeadIds)
    ? dept.deptHeadIds
    : dept?.deptHeadId
      ? [dept.deptHeadId]
      : [],
  deptHeads: Array.isArray(dept?.deptHeads)
    ? dept.deptHeads
    : dept?.deptHead
      ? [dept.deptHead]
      : [],
  deptHead:
    dept?.deptHead ||
    (Array.isArray(dept?.deptHeads) && dept.deptHeads.length > 0
      ? dept.deptHeads[0]
      : null),
  membersCount:
    dept?.membersCount ??
    dept?.memberCount ??
    dept?.members_count ??
    (Array.isArray(dept?.members) ? dept.members.length : 0),
});

/* ================= QUERIES ================= */

export function useDepartments(
  filters: Record<string, any> & { enabled?: boolean } = {}
) {
  const { enabled = true, ...params } = filters;

  return useQuery<Department[]>({
    queryKey: queryKeys.departments.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Department>>(
        "/sa/departments",
        { params }
      );

      const departments =
        data?.data?.departments || data?.departments || [];

      return departments.map(normalizeDepartment);
    },
    enabled,
  });
}

export function useDepartment(deptId?: string) {
  return useQuery<Department | null>({
    queryKey: queryKeys.departments.detail(deptId ?? "" ),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Department>>(
        `/sa/departments/${deptId}`
      );

      const department =
        data?.data?.department || data?.department;

      return department ? normalizeDepartment(department) : null;
    },
    enabled: !!deptId,
  });
}

/* ================= MUTATIONS ================= */

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, Record<string, any>>({
    mutationFn: async (departmentData) => {
      const { data } = await apiClient.post(
        "/sa/departments",
        departmentData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation<
    MutationResponse,
    Error,
    { deptId: string; [key: string]: any }
  >({
    mutationFn: async ({ deptId, ...updateData }) => {
      const { data } = await apiClient.put(
        `/sa/departments/${deptId}`,
        updateData
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.detail(variables.deptId),
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, string>({
    mutationFn: async (deptId) => {
      const { data } = await apiClient.delete(
        `/sa/departments/${deptId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
    },
  });
}

export function useAssignUserToDepartment() {
  const queryClient = useQueryClient();

  return useMutation<
    MutationResponse,
    Error,
    { departmentId: string; userId: string }
  >({
    mutationFn: async ({ departmentId, userId }) => {
      const { data } = await apiClient.post(
        `/sa/departments/${departmentId}/members`,
        { userId }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.detail(variables.departmentId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
    },
  });
}

export function useRemoveUserFromDepartment() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { departmentId: string; userId: string }
  >({
    mutationFn: async ({ departmentId, userId }) => {
      await apiClient.delete(
        `/sa/departments/${departmentId}/members/${userId}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.detail(variables.departmentId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
    },
  });
}