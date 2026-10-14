"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import AddDataForm from "@/components/AddFormData";
import { useAuth } from "@/lib/auth-context";
import { streamerApi } from "@/lib/api";

const columns = [
  { header: "Id", key: "id" },
  { header: "Nama", key: "namast" },
  { header: "Kategori", key: "kategorist" },
  {
    header: "Subscriber",
    key: "subscriber",
    format: (value) => Number(value ?? 0).toLocaleString("id-ID"),
  },
  {
    header: "Views",
    key: "views",
    format: (value) => Number(value ?? 0).toLocaleString("id-ID"),
  },
  {
    header: "Gambar (Cloudinary)",
    key: "image_url",
    render: (value) =>
      value ? (
        <img
          src={value}
          alt="Streamer"
          className="h-14 w-20 rounded-lg border border-white/10 object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-gray-500">-</span>
      ),
  },
];

export default function StreamerPage() {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const { token, loading: authLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const fetchStreamers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await streamerApi.list(token);
      setStreamers(res.data ?? []);
    } catch (err) {
      if (err.status === 401 || err.status === 422) {
        logout();
        router.push("/login");
        return;
      }
      setError(err.message || "Gagal mengambil data streamer");
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
    void Promise.resolve().then(fetchStreamers);
  }, [authLoading, isLoggedIn, fetchStreamers, router]);

  async function handleDelete(id) {
    if (!confirm("Hapus streamer ini? Gambar di Cloudinary ikut dihapus backend.")) return;
    try {
      await streamerApi.remove(id, token);
      fetchStreamers();
    } catch (err) {
      alert(err.message || "Gagal menghapus streamer");
    }
  }

  const tableColumns = [
    ...columns,
    {
      header: "Aksi",
      key: "aksi",
      render: (_, item) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(item)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
          >
            Ubah
          </button>
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
          Memuat data streamer...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Daftar Streamer
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Data dilindungi JWT. Gambar disimpan di Cloudinary via backend.
            </p>
          </div>
          <AddDataForm type="streamer" onSuccess={fetchStreamers} />
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <DataTable data={streamers} columns={tableColumns} />

        {editing && (
          <AddDataForm
            type="streamer"
            initialData={editing}
            onSuccess={fetchStreamers}
            onCloseEdit={() => setEditing(null)}
          />
        )}
      </div>
    </div>
  );
}
