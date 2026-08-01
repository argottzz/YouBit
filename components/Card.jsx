import Image from "next/image";
import { MoreVertical } from "lucide-react";

export default function Card({
  thumbnail,
  profile,
  title,
  channel,
  duration,
  views,
  time,
}) {
  return (
    <div className="w-full cursor-pointer">
      <div className="relative">
        <Image
          src={thumbnail}
          alt="Thumbnail"
          width={500}
          height={300}
          className="w-full h-56 object-cover rounded-xl"
        />

        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        {duration}
        </span>
      </div>

      <div className="flex mt-3">
        <Image
          src={profile}
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full"
        />

        <div className="flex-1 ml-3">
          <h2 className="text-base font-semibold leading-5">
            {title}
          </h2>

          <p className="text-sm text-gray-500">{channel}</p>

          <p className="text-sm text-gray-500">
            {views} • {time}
          </p>
        </div>

        <button className="p-1">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}