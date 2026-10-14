"use client";

import { useRef, useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];

export function validateImageFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const extOk = ALLOWED_EXT.some((ext) => name.endsWith(ext));
  const typeOk = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
  if (!extOk || !typeOk) return "Hanya file jpg, jpeg, png yang diperbolehkan";
  if (file.size > MAX_FILE_SIZE) return "Ukuran gambar maksimal 2MB";
  return null;
}

export default function ImageUploader({
  label,
  preview,
  required = false,
  hint = "Format jpg/jpeg/png, maksimal 2MB.",
  onFile,
  onError,
}: {
  label: string;
  preview?: string | null;
  required?: boolean;
  hint?: string;
  onFile: (file: File | null) => void;
  onError?: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      onFile(null);
      return;
    }
    const problem = validateImageFile(file);
    if (problem) {
      onError?.(problem);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setLocalPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    onFile(file);
  }

  const shown = localPreview ?? preview ?? null;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        required={required}
        onChange={handleChange}
        className="w-full rounded-xl border border-line bg-secondary px-4 py-2.5 text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-base"
      />
      <p className="mt-1 text-xs text-muted">{hint}</p>
      {shown && (
        <img
          src={shown}
          alt="Pratinjau"
          className="mt-3 h-40 w-full rounded-xl border border-line object-cover"
        />
      )}
    </div>
  );
}
