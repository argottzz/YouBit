"use client";

import { useState, type FormEvent } from "react";
import type { Video, VideoPayload, Visibility } from "@/types/video";
import FormInput from "@/components/common/FormInput";
import ImageUploader from "@/components/common/ImageUploader";

const VISIBILITIES: Visibility[] = ["public", "private", "unlisted"];

export default function VideoForm({
  initial,
  channelId,
  loading,
  error,
  onSubmit,
}: {
  initial?: Video;
  channelId: number;
  loading: boolean;
  error: string;
  onSubmit: (payload: VideoPayload) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [duration, setDuration] = useState(
    initial ? String(initial.duration_seconds ?? 0) : "0",
  );
  const [visibility, setVisibility] = useState<Visibility>(
    initial?.visibility ?? "public",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) return setFormError("Judul video wajib diisi");
    const duration_seconds = Number(duration);
    if (!Number.isInteger(duration_seconds) || duration_seconds < 0) {
      return setFormError("Durasi harus bilangan bulat >= 0 (detik)");
    }

    onSubmit({
      channel_id: channelId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      duration_seconds,
      visibility,
      imageFile,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Judul Video"
        placeholder="Judul video"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
      />
      <FormInput
        label="Deskripsi"
        textarea
        rows={4}
        placeholder="Deskripsi video (opsional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Kategori"
          placeholder="Contoh: Edukasi"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={50}
        />
        <FormInput
          label="Durasi (detik)"
          type="number"
          min="0"
          step="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <FormInput
        label="Visibilitas"
        select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value as Visibility)}
      >
        {VISIBILITIES.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </FormInput>

      <ImageUploader
        label={`Thumbnail ${initial ? "(opsional — ganti jika perlu)" : "(opsional)"}`}
        preview={initial?.image_url}
        onFile={setImageFile}
        onError={setFormError}
      />

      {(formError || error) && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError || error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-base transition hover:brightness-110 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Tambah Video"}
      </button>
    </form>
  );
}
