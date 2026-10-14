"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EmptyState, LoadingState } from "@/components/common/states";
import VideoForm from "@/components/video/VideoForm";
import { ApiError, channelApi, videoApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Channel } from "@/types/channel";
import type { VideoPayload } from "@/types/video";

export default function NewVideoPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchChannel = useCallback(async () => {
    if (!token || !user) return;
    try {
      setChannel(await channelApi.myChannel(token, user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat channel");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user) void Promise.resolve().then(fetchChannel);
  }, [token, user, fetchChannel]);

  async function handleSubmit(payload: VideoPayload) {
    setSaving(true);
    setError("");
    try {
      const res = await videoApi.create(payload, token);
      router.push(`/videos/${res.data.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menambahkan video");
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
        <h1 className="mb-6 text-2xl font-bold text-ink">Tambah Video</h1>

        {loading ? (
          <LoadingState message="Memuat channel..." />
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
          <div className="max-w-2xl rounded-2xl border border-line bg-card p-5 md:p-6">
            <VideoForm
              channelId={channel.id}
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
