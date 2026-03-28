import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/queryKeys";
import apiClient from "@/lib/axios";

/**
 * Types
 */

export interface AttendanceStats {
  total?: number;
  present?: number;
  absent?: number;
  [key: string]: any;
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface Volunteer {
  _id: string;
  name: string;
  [key: string]: any;
}

/**
 * Fest attendance stats
 */
export function useFestAttendanceStats() {
  return useQuery<AttendanceStats | null>({
    queryKey: queryKeys.attendance.festStats(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/volunteer/attendance/fest/stats"
      );
      return data?.data?.stats || data?.stats || data?.data || data || null;
    },
  });
}

/**
 * Competition attendance stats
 */
export function useCompetitionAttendanceStats(competitionId?: string) {
  return useQuery<AttendanceStats | null>({
    queryKey: queryKeys.attendance.competitionStats(competitionId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/volunteer/attendance/competition/${competitionId ?? ""}/stats`
      );
      return data?.data?.stats || data?.stats || data?.data || data || null;
    },
    enabled: !!competitionId,
  });
}

/**
 * Mark competition attendance
 */
export function useMarkCompetitionAttendance() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { competitionId: string; userId: string }
  >({
    mutationFn: async ({ competitionId, userId }) => {
      const { data } = await apiClient.post(
        `/volunteer/attendance/competition/${competitionId ?? ""}`,
        { userId }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.competitionStats(
          variables.competitionId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.festStats(),
      });
    },
  });
}

/**
 * Mark fest attendance
 */
export function useMarkFestAttendance() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { userId?: string; qrData?: string }
  >({
    mutationFn: async ({ userId, qrData }) => {
      const { data } = await apiClient.post(
        "/volunteer/attendance/fest",
        {
          ...(userId ? { userId } : {}),
          ...(qrData ? { qrData } : {}),
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.festStats(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.participants(""),
        exact: false,
      });
    },
  });
}

/**
 * Search participants
 */
export function useSearchParticipants(query?: string) {
  return useQuery<Participant[]>({
    queryKey: queryKeys.attendance.participants(query ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/volunteer/participants/search",
        {
          params: { query },
        }
      );

      return (
        data?.data?.participants ||
        data?.participants ||
        (Array.isArray(data?.data) ? data.data : []) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!query && query.trim().length >= 2,
  });
}

/**
 * Participant details
 */
export function useParticipantDetails(userId?: string) {
  return useQuery<Participant | null>({
    queryKey: queryKeys.attendance.participant(userId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        `/volunteer/participants/${userId}`
      );

      return (
        data?.data?.participant ||
        data?.participant ||
        data?.data ||
        data ||
        null
      );
    },
    enabled: !!userId,
  });
}

/**
 * Verify QR
 */
export function useVerifyQRCode() {
  return useMutation<any, Error, { qrData: string }>({
    mutationFn: async ({ qrData }) => {
      const { data } = await apiClient.post("/qr/verify", { qrData });
      return data?.data || data;
    },
  });
}

/**
 * Volunteer profile
 */
export function useVolunteerAttendanceProfile() {
  return useQuery<any>({
    queryKey: queryKeys.attendance.volunteerProfile(),
    queryFn: async () => {
      const { data } = await apiClient.get("/volunteer/my-events");
      return data?.data || null;
    },
  });
}

/**
 * Search participants with competition filter
 */
export function useSearchParticipantsWithComp(
  query?: string,
  competitionId?: string | null
) {
  return useQuery<Participant[]>({
    queryKey: [...queryKeys.attendance.participants(query ?? ""), competitionId ?? ""],
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/volunteer/participants/search",
        {
          params: {
            query,
            ...(competitionId ? { competitionId } : {}),
          },
        }
      );

      return (
        data?.data?.participants ||
        data?.participants ||
        (Array.isArray(data?.data) ? data.data : []) ||
        (Array.isArray(data) ? data : [])
      );
    },
    enabled: !!query && query.trim().length >= 2,
  });
}

/**
 * Registration desk volunteers
 */
export function useRegistrationDeskVolunteers() {
  return useQuery<Volunteer[]>({
    queryKey: queryKeys.attendance.registrationDeskVolunteers(),
    queryFn: async () => {
      const { data } = await apiClient.get<any>(
        "/volunteer/registration-desk"
      );

      return (
        data?.data?.volunteers ||
        data?.volunteers ||
        (Array.isArray(data?.data) ? data.data : []) ||
        (Array.isArray(data) ? data : [])
      );
    },
  });
}

/**
 * Assign registration desk volunteer
 */
export function useAssignRegistrationDeskVolunteer() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { userId: string }>({
    mutationFn: async ({ userId }) => {
      const { data } = await apiClient.post(
        "/volunteer/registration-desk/assign",
        { userId }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.registrationDeskVolunteers(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.volunteerProfile(),
      });
    },
  });
}

/**
 * Remove registration desk volunteer
 */
export function useRemoveRegistrationDeskVolunteer() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { volunteerId: string }>({
    mutationFn: async ({ volunteerId }) => {
      const { data } = await apiClient.delete(
        `/volunteer/registration-desk/${volunteerId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.registrationDeskVolunteers(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.volunteerProfile(),
      });
    },
  });
}