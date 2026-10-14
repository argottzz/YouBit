"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import VideoGrid from "@/components/video/VideoGrid";
import VideoVisibilityBadge from "@/components/video/VideoVisibilityBadge";
import { ApiError, videoApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatCount, formatDate } from "@/lib/format";
import type { Video } from "@/types/video";

export default function VideoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { user, token, isAdmin } = useAuth();

  const [video, setVideo] = useState<Video | null>(null);
  const [others, setOthers] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("ID video tidak valid");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await videoApi.get(id, token);
      setVideo(res.data);

      if (token) {
        const list = await videoApi.list(token, { channel_id: res.data.channel_id });
        setOthers(list.data.filter((v) => v.id !== res.data.id).slice(0, 8));
      } else {
        const pub = await videoApi.listPublic({ limit: 20 });
        setOthers(
          pub.data
            .filter((v) => v.channel_id === res.data.channel_id && v.id !== res.data.id)
            .slice(0, 8),
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat video");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void Promise.resolve().then(fetchDetail);
  }, [fetchDetail]);

  async function handleDelete() {
    if (!video) return;
    setDeleting(true);
    try {
      await videoApi.remove(video.id, token);
      router.push("/studio");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menghapus video");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  const canManage =
    !!video &&
    !!user &&
    (isAdmin || video.channel_owner_id === user.id);

  return (
    <AppShell>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
      >
        <ChevronLeft size={16} /> Kembali ke beranda
      </Link>

      {loading ? (
        <LoadingState message="Memuat video..." />
      ) : error || !video ? (
        <ErrorState message={error || "Video tidak ditemukan"} onRetry={fetchDetail} />
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-line bg-card">
            {video.image_url ? (
              <img
                src={video.image_url}
                alt={video.title}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-secondary text-muted">
                Tanpa thumbnail
              </div>
            )}
            <div className="p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <VideoVisibilityBadge visibility={video.visibility} />
                {video.category && (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted">
                    {video.category}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-xl font-bold text-ink md:text-2xl">
                {video.title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {formatCount(video.views_count)} ditonton •{" "}
                {formatDate(video.created_at)}
              </p>

              <Link
                href={`/channels/${video.channel_id}`}
                className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-secondary/50 p-3 transition hover:border-primary"
              >
                {video.channel_avatar ? (
                  <img
                    src={video.channel_avatar}
                    alt={video.channel_name ?? "Channel"}
                    className="h-11 w-11 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-lg font-bold text-primary">
                    {(video.channel_name ?? "V").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">
                    {video.channel_name}
                  </span>
                  <span className="block text-xs text-muted">
                    Kunjungi channel
                  </span>
                </span>
              </Link>

              {video.description && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
                  {video.description}
                </p>
              )}

              {canManage && (
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/studio/videos/${video.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-secondary"
                  >
                    <Pencil size={15} /> Edit Video
                  </Link>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110"
                  >
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              )}
            </div>
          </section>

          {others.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-ink">
                Video lain dari channel ini
              </h2>
              <VideoGrid videos={others} />
            </section>
          )}

          {others.length === 0 && (
            <div className="mt-8">
              <EmptyState title="Tidak ada video lain dari channel ini" />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus video?"
        message="Video dan thumbnail-nya akan dihapus permanen."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </AppShell>
  );
}
