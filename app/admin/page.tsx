"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserTable from "@/components/admin/UserTable";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import { ApiError, usersApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/types/user";

export default function AdminPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await usersApi.list(token);
      setUsers(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat pengguna");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) void Promise.resolve().then(fetchUsers);
  }, [token, fetchUsers]);

  async function handleRoleChange(id: number, role: "admin" | "user") {
    setBusyId(id);
    try {
      await usersApi.updateRole(id, role, token);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengubah role");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await usersApi.remove(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menghapus pengguna");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <AppShell>
        <h1 className="text-2xl font-bold text-ink">Admin</h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          Kelola pengguna dan role. Kamu tidak dapat mengubah role dirimu sendiri.
        </p>

        {loading ? (
          <LoadingState message="Memuat pengguna..." />
        ) : error && users.length === 0 ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : users.length === 0 ? (
          <EmptyState title="Belum ada pengguna" />
        ) : (
          user && (
            <UserTable
              users={users}
              currentUserId={user.id}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
              busyId={busyId}
            />
          )
        )}

        {error && users.length > 0 && (
          <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
