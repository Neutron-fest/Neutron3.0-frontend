import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/* ================= TYPES ================= */

export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface Competition {
  id: string;
  title?: string;
}

export interface Team {
  id: string;
  name?: string;
}

export interface Registration {
  id: string;
  status?: string;
  [key: string]: any;
}

export interface RegistrationRow {
  registration?: Registration;
  user?: User | null;
  competition?: Competition | null;
  team?: Team | null;
  formDetails?: any;
  readiness?: any;
  registrationId?: string | null;
  id?: string;
  [key: string]: any;
}

export interface NormalizedRegistration extends Registration {
  registrationId: string | null;
  user?: User | null;
  competition?: Competition | null;
  team?: Team | null;
  formDetails?: any;
  readiness?: any;
}

export interface Filters {
  competitionId?: string;
  status?: string;
}

/* ================= HOOKS ================= */

/**
 * Fetch registrations for DH/SA dashboard
 */
export function usePendingRegistrations(filters: Filters = {}) {
  return useQuery<NormalizedRegistration[]>({
    queryKey: queryKeys.registrations.pending(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<any>("/registration/pending", {
        params: filters,
      });

      const rows: RegistrationRow[] =
        data?.data?.registrations ||
        data?.registrations ||
        (Array.isArray(data?.data) ? data.data : null) ||
        (Array.isArray(data) ? data : []);

      return rows.map((row): NormalizedRegistration => {
        if (row?.registration && typeof row.registration === "object") {
          return {
            ...row.registration,
            registrationId: row.registration.id,
            user: row.user || null,
            competition: row.competition || null,
            team: row.team || null,
            formDetails: row.formDetails || null,
            readiness: row.readiness || null,
          };
        }

        return {
          ...(row as Registration),
          registrationId: row?.registrationId || row?.id || null,
        };
      });
    },
  });
}

/**
 * Approve a registration
 */
export function useApproveRegistration() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (registrationId: string) => {
      const { data } = await apiClient.post(
        `/registration/${registrationId}/approve`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.registrations.all,
      });
    },
  });
}

/**
 * Reject a registration
 */
export function useRejectRegistration() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { registrationId: string; reason?: string }
  >({
    mutationFn: async ({ registrationId, reason }) => {
      const { data } = await apiClient.post(
        `/registration/${registrationId}/reject`,
        { reason }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.registrations.all,
      });
    },
  });
}