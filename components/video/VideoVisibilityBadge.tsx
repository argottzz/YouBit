import type { Visibility } from "@/types/video";

const styles: Record<Visibility, string> = {
  public: "bg-success/15 text-success",
  private: "bg-secondary text-muted",
  unlisted: "bg-accent/15 text-accent",
};

const labels: Record<Visibility, string> = {
  public: "Public",
  private: "Private",
  unlisted: "Unlisted",
};

export default function VideoVisibilityBadge({
  visibility,
}: {
  visibility: Visibility;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[visibility]}`}
    >
      {labels[visibility]}
    </span>
  );
}
