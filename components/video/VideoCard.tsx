import Link from "next/link";
import type { Video } from "@/types/video";
import { formatCount, formatDate, formatDuration } from "@/lib/format";
import VideoVisibilityBadge from "@/components/video/VideoVisibilityBadge";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-line bg-card">
        {video.image_url ? (
          <img
            src={video.image_url}
            alt={video.title}
            loading="lazy"
            className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-secondary text-sm text-muted">
            Tanpa thumbnail
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration_seconds)}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        {video.channel_avatar ? (
          <img
            src={video.channel_avatar}
            alt={video.channel_name ?? "Channel"}
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
            {(video.channel_name ?? "V").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition group-hover:text-primary">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted">{video.channel_name}</p>
          <p className="text-xs text-muted">
            {formatCount(video.views_count)} ditonton • {formatDate(video.created_at)}
          </p>
          {video.visibility !== "public" && (
            <div className="mt-1">
              <VideoVisibilityBadge visibility={video.visibility} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
