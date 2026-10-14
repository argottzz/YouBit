"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChannelForm from "@/components/channel/ChannelForm";
import ChannelHeader from "@/components/channel/ChannelHeader";
import { LoadingState } from "@/components/common/states";
import { ApiError, channelApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Channel, ChannelPayload } from "@/types/channel";

export default function ChannelSettingsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

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

  async function handleSubmit(payload: ChannelPayload) {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      if (channel) {
        const res = await channelApi.update(channel.id, payload, token);
        setChannel((prev) => (prev ? { ...prev, ...res.data } : prev));
        setSaved(true);
      } else {
        const res = await channelApi.create(payload, token);
        setChannel(res.data);
        router.push("/studio");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan channel");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <h1 className="text-2xl font-bold text-ink">
          {channel ? "Pengaturan Channel" : "Buat Channel"}
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          {channel
            ? "Ubah nama, deskripsi, avatar, dan banner channelmu."
            : "Setiap pengguna hanya dapat memiliki satu channel."}
        </p>

        {loading ? (
          <LoadingState message="Memuat channel..." />
        ) : (
          <div className="space-y-6">
            {channel && (
              <ChannelHeader channel={channel} videoCount={channel.videos?.length ?? 0} canManage={false} />
            )}
            {saved && (
              <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                Channel berhasil disimpan.
              </p>
            )}
            <div className="max-w-2xl rounded-2xl border border-line bg-card p-5 md:p-6">
              <ChannelForm
                initial={channel ?? undefined}
                loading={saving}
                error={error}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
