"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChannelHeader from "@/components/channel/ChannelHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import VideoVisibilityBadge from "@/components/video/VideoVisibilityBadge";
import { ApiError, channelApi, videoApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatCount, formatDate, formatFullCount } from "@/lib/format";
import type { Channel } from "@/types/channel";
import type { Video } from "@/types/video";

export default function StudioPage() {
  const { user, token } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudio = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    setError("");
    try {
      const mine = await channelApi.myChannel(token, user.id);
      setChannel(mine);
      if (mine) {
        const list = await videoApi.list(token, { channel_id: mine.id });
        setVideos(list.data);
      } else {
        setVideos([]);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat studio");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user) void Promise.resolve().then(fetchStudio);
  }, [token, user, fetchStudio]);

  async function handleDelete() {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await videoApi.remove(deleteId, token);
      setDeleteId(null);
      fetchStudio();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menghapus video");
    } finally {
      setDeleting(false);
    }
  }

  const totalViews = videos.reduce((sum, v) => sum + (v.views_count ?? 0), 0);

  return (
    <ProtectedRoute>
      <AppShell>
        <h1 className="text-2xl font-bold text-ink">Creator Studio</h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          Kelola channel dan video milikmu.
        </p>

        {loading ? (
          <LoadingState message="Memuat studio..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchStudio} />
        ) : !channel ? (
          <EmptyState
            title="Kamu belum memiliki channel"
            message="Buat channel terlebih dahulu sebelum menambahkan video."
            action={
              <Link
                href="/studio/channel"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-base transition hover:brightness-110"
              >
                Buat Channel
              </Link>
            }
          />
        ) : (
          <>
            <ChannelHeader channel={channel} videoCount={videos.length} canManage />

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-line bg-card p-4 text-center">
                <p className="text-xl font-bold text-ink">{videos.length}</p>
                <p className="mt-1 text-xs text-muted">Video</p>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4 text-center">
                <p className="text-xl font-bold text-ink">{formatCount(totalViews)}</p>
                <p className="mt-1 text-xs text-muted">Total Views</p>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4 text-center">
                <p className="text-xl font-bold text-ink">
                  {formatFullCount(channel.subscriber_count)}
                </p>
                <p className="mt-1 text-xs text-muted">Subscriber</p>
              </div>
            </div>

            <div className="mb-4 mt-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Video saya</h2>
              <Link
                href="/studio/videos/new"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110"
              >
                <Plus size={16} /> Tambah Video
              </Link>
            </div>

            {videos.length === 0 ? (
              <EmptyState title="Belum ada video di channel ini" />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-line bg-card">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-secondary">
                    <tr>
                      {["Judul", "Views", "Upload", "Visibilitas", "Aksi"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {videos.map((v) => (
                      <tr key={v.id}>
                        <td className="max-w-xs truncate px-5 py-3 text-sm font-medium text-ink">
                          {v.title}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">
                          {formatFullCount(v.views_count)}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">
                          {formatDate(v.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <VideoVisibilityBadge visibility={v.visibility} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <Link
                              href={`/studio/videos/${v.id}/edit`}
                              className="rounded-lg border border-line p-2 text-muted transition hover:text-ink"
                              aria-label="Edit video"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(v.id)}
                              className="rounded-lg bg-danger p-2 text-base transition hover:brightness-110"
                              aria-label="Hapus video"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-6 text-xs text-muted">
              Terakhir diperbarui: {formatDate(channel.created_at)}
            </p>
          </>
        )}

        <ConfirmDialog
          open={deleteId !== null}
          title="Hapus video?"
          message="Video dan thumbnail-nya akan dihapus permanen."
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
