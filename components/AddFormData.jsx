"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { streamerApi, youtuberApi } from "@/lib/api";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];

const FIELDS = {
  streamer: [
    { key: "name", label: "Nama", placeholder: "Nama streamer", max: 50 },
    { key: "category", label: "Kategori", placeholder: "Contoh: Gaming", max: 50 },
    { key: "subscriber", label: "Subscriber", type: "number" },
    { key: "views", label: "Views", type: "number" },
  ],
  youtuber: [
    { key: "name", label: "Nama", placeholder: "Nama youtuber", max: 100 },
    { key: "category", label: "Kategori", placeholder: "Contoh: Edukasi", max: 50 },
    { key: "subscriber", label: "Subscriber", type: "number" },
    { key: "views", label: "Views", type: "number" },
    { key: "total_video", label: "Total Video", type: "number" },
  ],
};

function fromInitial(type, initialData) {
  if (!initialData) return { name: "", category: "", subscriber: "", views: "", total_video: "" };
  if (type === "youtuber") {
    return {
      name: initialData.nama_youtuber ?? "",
      category: initialData.kategori ?? "",
      subscriber: String(initialData.subscriber ?? ""),
      views: String(initialData.views ?? ""),
      total_video: String(initialData.total_video ?? ""),
    };
  }
  return {
    name: initialData.namast ?? "",
    category: initialData.kategorist ?? "",
    subscriber: String(initialData.subscriber ?? ""),
    views: String(initialData.views ?? ""),
    total_video: "",
  };
}

function isValidImage(file) {
  const name = file.name.toLowerCase();
  return (
    ALLOWED_EXT.some((ext) => name.endsWith(ext)) &&
    ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
  );
}

export default function AddDataForm({ type = "streamer", onSuccess, initialData = null, onCloseEdit }) {
  const isEdit = !!initialData;
  const isStreamer = type === "streamer";
  const api = isStreamer ? streamerApi : youtuberApi;
  const { token } = useAuth();

  const [isOpen, setIsOpen] = useState(() => isEdit);
  const [values, setValues] = useState(() => fromInitial(type, initialData));
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(() => initialData?.image_url ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function set(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImage(file)) return setMessage("Hanya file jpg, jpeg, png yang diperbolehkan");
    if (file.size > MAX_FILE_SIZE) return setMessage("Ukuran gambar maksimal 2MB");
    setMessage("");
    setImageFile(file);
    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  function closeModal() {
    if (loading) return;
    setIsOpen(false);
    setValues(fromInitial(type, null));
    setImageFile(null);
    setPreview("");
    setMessage("");
    onCloseEdit?.();
  }

  function parseCount(raw, label) {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0) throw new Error(`${label} harus bilangan bulat >= 0`);
    return n;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const name = values.name.trim();
      const category = values.category.trim();
      if (!name || !category) throw new Error("Nama dan kategori wajib diisi");
      const subscriber = parseCount(values.subscriber, "Subscriber");
      const views = parseCount(values.views, "Views");

      let payload;
      if (isStreamer) {
        if (!isEdit && !imageFile) throw new Error("Gambar wajib diupload (jpg/jpeg/png, maks 2MB)");
        payload = { namast: name, kategorist: category, subscriber, views, imageFile };
      } else {
        const total_video = parseCount(values.total_video, "Total video");
        payload = { nama_youtuber: name, kategori: category, subscriber, views, total_video, imageFile };
      }

      if (isEdit) {
        await api.update(initialData.id, payload, token);
        setMessage(`${isStreamer ? "Streamer" : "Youtuber"} berhasil diubah!`);
      } else {
        await api.create(payload, token);
        setMessage(`${isStreamer ? "Streamer" : "Youtuber"} berhasil ditambahkan!`);
      }

      onSuccess?.();
      setTimeout(closeModal, 800);
    } catch (error) {
      setMessage(error.message || "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    if (isEdit) return null;
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700"
      >
        <span className="text-lg leading-none">+</span>
        Tambah {isStreamer ? "Streamer" : "Youtuber"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={closeModal}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Ubah" : "Tambah"} {isStreamer ? "Streamer" : "Youtuber"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isEdit
                ? "Kosongkan gambar jika tidak ingin mengganti."
                : `Gambar akan diupload ke Cloudinary (folder ${isStreamer ? "streamers" : "youtubers"}).`}
            </p>
          </div>
          <button
            onClick={closeModal}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS[type].map((field) => (
            <div key={field.key}>
              <label className="mb-2 block text-sm font-medium text-gray-300">{field.label}</label>
              <input
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={(e) => set(field.key, e.target.value)}
                maxLength={field.max}
                min={field.type === "number" ? "0" : undefined}
                step={field.type === "number" ? "1" : undefined}
                required
                className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-600"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Gambar {isStreamer && !isEdit ? "(wajib)" : "(opsional)"}
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required={isStreamer && !isEdit}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
            />
            <p className="mt-1 text-xs text-gray-500">Format jpg/jpeg/png, maksimal 2MB.</p>
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 h-40 w-full rounded-xl border border-white/10 object-cover" />
            )}
          </div>

          {message && (
            <div className="rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-gray-300">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : `Tambah ${isStreamer ? "Streamer" : "Youtuber"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
