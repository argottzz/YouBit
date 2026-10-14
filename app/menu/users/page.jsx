"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import { useAuth } from "@/lib/auth-context";
import { usersApi } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, token, loading: authLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await usersApi.list(token);
      setUsers(res.data ?? []);
    } catch (err) {
      if (err.status === 401 || err.status === 422) {
        logout();
        router.push("/login");
        return;
      }
      setError(err.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  }, [token, logout, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/menu/streamer");
      return;
    }
    void Promise.resolve().then(fetchUsers);
  }, [authLoading, isLoggedIn, user, fetchUsers, router]);

  async function handleRole(id, role) {
    try {
      await usersApi.updateRole(id, role, token);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Gagal mengubah role");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus user ini?")) return;
    try {
      await usersApi.remove(id, token);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Gagal menghapus user");
    }
  }

  const tableColumns = [
    { header: "Id", key: "id" },
    { header: "Username", key: "username" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
    {
      header: "Aksi",
      key: "aksi",
      render: (_, item) => (
        <div className="flex flex-wrap gap-2">
          {item.role === "user" ? (
            <button
              onClick={() => handleRole(item.id, "admin")}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
            >
              Jadikan Admin
            </button>
          ) : (
            <button
              onClick={() => handleRole(item.id, "user")}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
            >
              Jadikan User
            </button>
          )}
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  if (authLoading || loading) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-10 text-gray-400">
          Memuat data user...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Daftar User</h1>
        <p className="mt-1 mb-8 text-sm text-gray-400">
          Khusus admin. Mengikuti GET /api/users, PUT /api/users/:id/role, DELETE /api/users/:id.
        </p>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <DataTable data={users} columns={tableColumns} />
      </div>
    </div>
  );
}
