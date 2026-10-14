"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorState, LoadingState } from "@/components/common/states";
import VideoForm from "@/components/video/VideoForm";
import { ApiError, videoApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Video, VideoPayload } from "@/types/video";

export default function EditVideoPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { token } = useAuth();
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchVideo = useCallback(async () => {
    if (!token) return;
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("ID video tidak valid");
      setLoading(false);
      return;
    }
    try {
      const res = await videoApi.get(id, token);
      setVideo(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat video");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (token) void Promise.resolve().then(fetchVideo);
  }, [token, fetchVideo]);

  async function handleSubmit(payload: VideoPayload) {
    if (!video) return;
    setSaving(true);
    setError("");
    try {
      await videoApi.update(video.id, payload, token);
      router.push(`/videos/${video.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <Link
          href="/studio"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
        >
          <ChevronLeft size={16} /> Kembali ke studio
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-ink">Edit Video</h1>

        {loading ? (
          <LoadingState message="Memuat video..." />
        ) : error || !video ? (
          <ErrorState message={error || "Video tidak ditemukan"} onRetry={fetchVideo} />
        ) : (
          <div className="max-w-2xl rounded-2xl border border-line bg-card p-5 md:p-6">
            <VideoForm
              initial={video}
              channelId={video.channel_id}
              loading={saving}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
