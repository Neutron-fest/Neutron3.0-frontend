"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import type { AxiosError } from "axios";

// ---- Types ----
type User = {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  // extend this as your backend grows
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type UsersResponse = {
  users: User[];
};

type ApiError = {
  message?: string;
};

// ---- Hook ----
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const response =
        await apiClient.get<ApiResponse<UsersResponse>>("/sa/users");

      if (response.data.success) {
        setUsers(response.data.data.users);
        setError(null);
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (
    userId: string | number,
    role: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        `/sa/users/${userId}/role`,
        { role },
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update role",
      };
    }
  };

  const suspendUser = async (
    userId: string | number,
    data: Record<string, unknown>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        `/sa/users/${userId}/suspend`,
        data,
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to suspend user",
      };
    }
  };

  const unsuspendUser = async (
    userId: string | number,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        `/sa/users/${userId}/unsuspend`,
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return {
        success: false,
        error: error.response?.data?.message || "Failed to unsuspend user",
      };
    }
  };

  const revokeUser = async (
    userId: string | number,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        `/sa/users/${userId}/revoke`,
        { reason },
      );

      if (response.data.success) {
        await fetchUsers();
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      const error = err as AxiosError<ApiError>;
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
