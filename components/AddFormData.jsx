"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { streamerApi } from "@/lib/api";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // mengikuti middleware/upload.ts backend
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];

function isValidImage(file) {
  const name = file.name.toLowerCase();
  const extOk = ALLOWED_EXT.some((ext) => name.endsWith(ext));
  const typeOk = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
  return extOk && typeOk;
}

// Form tambah/edit streamer. Gambar dikirim sebagai multipart field "image"
// ke backend, lalu backend yang mengupload ke Cloudinary (folder "streamers").
export default function AddDataForm({ type = "streamer", onSuccess, initialData = null, onCloseEdit }) {
  const isStreamer = type === "streamer";
  const { token } = useAuth();

  const [isOpen, setIsOpen] = useState(() => !!initialData);
  const [name, setName] = useState(() => initialData?.namast ?? "");
  const [category, setCategory] = useState(() => initialData?.kategorist ?? "");
  const [subscriber, setSubscriber] = useState(() =>
    initialData ? String(initialData.subscriber ?? "") : "",
  );
  const [views, setViews] = useState(() =>
    initialData ? String(initialData.views ?? "") : "",
  );
  const [imageFile, setImageFile] = useState(null);
  // Preview awal = gambar Cloudinary yang sudah ada (mode edit)
  const [preview, setPreview] = useState(() => initialData?.image_url ?? "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isEdit = !!initialData;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImage(file)) {
      setMessage("Hanya file jpg, jpeg, png yang diperbolehkan");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("Ukuran gambar maksimal 2MB");
      return;
    }

    setMessage("");
    setImageFile(file);
    // Preview lokal langsung saat file dipilih (tanpa useEffect)
    setPreview(URL.createObjectURL(file));
  }

  function openModal() {
    setIsOpen(true);
    setMessage("");
  }

  function closeModal() {
    if (loading) return;
    setIsOpen(false);
    setName("");
    setCategory("");
    setSubscriber("");
    setViews("");
    setImageFile(null);
    setPreview("");
    setMessage("");
    onCloseEdit?.();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImage(file)) {
      setMessage("Hanya file jpg, jpeg, png yang diperbolehkan");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("Ukuran gambar maksimal 2MB");
      return;
    }

    setMessage("");
    setImageFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!name.trim() || !category.trim()) {
        throw new Error("Nama dan kategori wajib diisi (maks 50 karakter)");
      }
      const sub = Number(subscriber);
      const v = Number(views);
      if (!Number.isInteger(sub) || sub < 0 || !Number.isInteger(v) || v < 0) {
        throw new Error("Subscriber dan views harus bilangan bulat >= 0");
      }
      if (!isEdit && !imageFile) {
        // Backend: "Gambar wajib diupload (field: image)"
        throw new Error("Gambar wajib diupload (jpg/jpeg/png, maks 2MB)");
      }

      const payload = isStreamer
        ? { namast: name.trim(), kategorist: category.trim(), subscriber: sub, views: v, imageFile }
        : { namast: name.trim(), kategorist: category.trim(), subscriber: sub, views: v, imageFile };

      if (isEdit) {
        await streamerApi.update(initialData.id, payload, token);
        setMessage("Streamer berhasil diubah!");
      } else {
        await streamerApi.create(payload, token);
        setMessage(`${isStreamer ? "Streamer" : "Youtuber"} berhasil ditambahkan!`);
      }

      setName("");
      setCategory("");
      setSubscriber("");
      setViews("");
      setImageFile(null);
      setPreview("");

      onSuccess?.();

      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
        onCloseEdit?.();
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage(error.message || `Gagal menyimpan ${isStreamer ? "streamer" : "youtuber"}.`);
    } finally {
      setLoading(false);
    }
  }

  // Mode edit: modal dikontrol dari parent via initialData, tanpa tombol "+"
  if (isEdit) {
    if (!isOpen) return null;
  } else {
    if (!isOpen) {
      return (
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30"
        >
          <span className="text-lg leading-none">+</span>
          Tambah {isStreamer ? "Streamer" : "Youtuber"}
        </button>
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Ubah" : "Tambah"} {isStreamer ? "Streamer" : "Youtuber"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {isEdit
                ? "Ubah data. Kosongkan gambar jika tidak ingin mengganti (gambar lama di Cloudinary tetap dipakai)."
                : "Gambar akan diupload ke Cloudinary via backend."}
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
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Nama
            </label>

            <input
              type="text"
              placeholder={`Nama ${isStreamer ? "streamer" : "youtuber"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-600"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Kategori
            </label>

            <input
              type="text"
              placeholder="Contoh: Gaming"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-600"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Subscriber
            </label>

            <input
              type="number"
              placeholder="Jumlah subscriber"
              value={subscriber}
              onChange={(e) => setSubscriber(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-600"
              required
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Views
            </label>

            <input
              type="number"
              placeholder="Jumlah views"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-600"
              required
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Gambar {isEdit ? "(opsional — ganti jika perlu)" : "(wajib)"}
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
              required={!isEdit}
            />
            <p className="mt-1 text-xs text-gray-500">
              Format jpg/jpeg/png, maksimal 2MB. Disimpan di Cloudinary (folder streamers).
            </p>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-40 w-full rounded-xl border border-white/10 object-cover"
              />
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
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : `Tambah ${isStreamer ? "Streamer" : "Youtuber"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
