"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ChannelHeader from "@/components/channel/ChannelHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import VideoGrid from "@/components/video/VideoGrid";
import { ApiError, channelApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Channel } from "@/types/channel";

export default function ChannelDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { user, token, isAdmin } = useAuth();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChannel = useCallback(async () => {
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("ID channel tidak valid");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await channelApi.get(id, token);
      setChannel(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal memuat channel");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void Promise.resolve().then(fetchChannel);
  }, [fetchChannel]);

  const canManage =
    !!channel && !!user && (isAdmin || channel.user_id === user.id);

  return (
    <AppShell>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
      >
        <ChevronLeft size={16} /> Kembali ke beranda
      </Link>

      {loading ? (
        <LoadingState message="Memuat channel..." />
      ) : error || !channel ? (
        <ErrorState message={error || "Channel tidak ditemukan"} onRetry={fetchChannel} />
      ) : (
        <>
          <ChannelHeader
            channel={channel}
            videoCount={channel.videos?.length ?? 0}
            canManage={canManage}
          />

          <h2 className="mb-4 mt-8 text-lg font-bold text-ink">Video channel ini</h2>
          {channel.videos && channel.videos.length > 0 ? (
            <VideoGrid videos={channel.videos} />
          ) : (
            <EmptyState
              title="Channel ini belum memiliki video"
              message={
                canManage
                  ? "Tambahkan video pertamamu melalui Creator Studio."
                  : undefined
              }
            />
          )}
        </>
      )}
    </AppShell>
  );
}
