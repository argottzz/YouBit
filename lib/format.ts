export function formatCount(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("id-ID", { notation: "compact" }).format(n);
}

export function formatFullCount(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString("id-ID");
}

export function formatDuration(totalSeconds: number | null | undefined): string {
  const s = Math.max(0, Math.floor(Number(totalSeconds ?? 0)));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
