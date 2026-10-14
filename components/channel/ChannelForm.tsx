"use client";

import { useState, type FormEvent } from "react";
import type { Channel, ChannelPayload } from "@/types/channel";
import FormInput, { FormTextarea } from "@/components/common/FormInput";
import ImageUploader from "@/components/common/ImageUploader";

export default function ChannelForm({
  initial,
  loading,
  error,
  onSubmit,
}: {
  initial?: Channel;
  loading: boolean;
  error: string;
  onSubmit: (payload: ChannelPayload) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) return setFormError("Nama channel wajib diisi");

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      avatarFile,
      bannerFile,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nama Channel"
        placeholder="Nama channel"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        required
      />
      <FormTextarea
        label="Deskripsi Channel"
        rows={4}
        placeholder="Deskripsi channel (opsional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <ImageUploader
        label="Avatar (opsional)"
        preview={initial?.avatar_url}
        onFile={setAvatarFile}
        onError={setFormError}
      />
      <ImageUploader
        label="Banner (opsional)"
        preview={initial?.banner_url}
        onFile={setBannerFile}
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
        {loading ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Buat Channel"}
      </button>
    </form>
  );
}
