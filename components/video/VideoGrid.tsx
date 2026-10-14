import type { Video } from "@/types/video";
import VideoCard from "@/components/video/VideoCard";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
