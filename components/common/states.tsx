import type { ReactNode } from "react";

export function LoadingState({ message = "Memuat..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-card px-6 py-12">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {message && <p className="mt-1 text-sm text-muted">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/10 px-6 py-6 text-center">
      <p className="text-sm text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-ink transition hover:bg-secondary"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
