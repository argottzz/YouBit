import Link from "next/link";
import type { Channel } from "@/types/channel";
import { formatCount, formatFullCount } from "@/lib/format";

export default function ChannelHeader({
  channel,
  videoCount,
  canManage,
}: {
  channel: Channel;
  videoCount: number;
  canManage: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      {channel.banner_url ? (
        <img
          src={channel.banner_url}
          alt={`Banner ${channel.name}`}
          className="h-36 w-full object-cover md:h-52"
        />
      ) : (
        <div className="h-36 w-full bg-secondary md:h-52" />
      )}

      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:p-6">
        {channel.avatar_url ? (
          <img
            src={channel.avatar_url}
            alt={channel.name}
            className="h-20 w-20 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary">
            {channel.name.charAt(0).toUpperCase()}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-ink md:text-2xl">
            {channel.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            @{channel.owner_username ?? "kreator"} •{" "}
            {formatCount(channel.subscriber_count)} subscriber • {videoCount} video
          </p>
          {channel.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {channel.description}
            </p>
          )}
        </div>

        {canManage && (
          <div className="flex shrink-0 gap-2">
            <Link
              href="/studio/channel"
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-secondary"
            >
              Edit Channel
            </Link>
            <Link
              href="/studio/videos/new"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110"
            >
              Tambah Video
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ChannelStats({ channel }: { channel: Channel }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl border border-line bg-card p-4 text-center">
        <p className="text-xl font-bold text-ink">
          {formatFullCount(channel.subscriber_count)}
        </p>
        <p className="mt-1 text-xs text-muted">Subscriber</p>
      </div>
      <div className="rounded-2xl border border-line bg-card p-4 text-center">
        <p className="text-xl font-bold text-ink">{channel.videos?.length ?? 0}</p>
        <p className="mt-1 text-xs text-muted">Video</p>
      </div>
      <div className="rounded-2xl border border-line bg-card p-4 text-center">
        <p className="text-xl font-bold text-ink">
          {formatCount(
            channel.videos?.reduce((sum, v) => sum + (v.views_count ?? 0), 0) ?? 0,
          )}
        </p>
        <p className="mt-1 text-xs text-muted">Total Views</p>
      </div>
    </div>
  );
}
