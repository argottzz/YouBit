"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Hapus",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
