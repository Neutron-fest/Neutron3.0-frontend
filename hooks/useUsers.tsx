"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";

/* ================= TYPES ================= */

export type Role = string; // upgrade later to union

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: Role;
  suspended?: boolean;
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UsersData {
  users: User[];
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

/* ================= HOOK ================= */

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await apiClient.get<ApiResponse<UsersData>>(
        "/sa/users"
      );

      if (response.data.success) {
        setUsers(response.data.data.users);
        setError(null);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (
    userId: string,
    role: Role
  ): Promise<ActionResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<null>>(
        `/sa/users/${userId}/role`,
        { role }
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update role",
      };
    }
  };

  const suspendUser = async (
    userId: string,
    data: Record<string, unknown>
  ): Promise<ActionResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/sa/users/${userId}/suspend`,
        data
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to suspend user",
      };
    }
  };

  const unsuspendUser = async (
    userId: string
  ): Promise<ActionResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/sa/users/${userId}/unsuspend`
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to unsuspend user",
      };
    }
  };

  const revokeUser = async (
    userId: string,
    reason: string
  ): Promise<ActionResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/sa/users/${userId}/revoke`,
        { reason }
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to revoke user",
      };
    }
  };

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    updateUserRole,
    suspendUser,
    unsuspendUser,
    revokeUser,
  };
}