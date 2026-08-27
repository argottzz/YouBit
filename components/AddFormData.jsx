"use client";

import { useState } from "react";

export default function AddDataForm({ type, onSuccess }) {
  const isStreamer = type === "streamer";

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subscriber, setSubscriber] = useState("");
  const [views, setViews] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const body = isStreamer
        ? {
            namast: name,
            kategorist: category,
            subscriber: Number(subscriber),
            views: Number(views),
          }
        : {
            namayt: name,
            kategoriyt: category,
            subscriber: Number(subscriber),
            views: Number(views),
          };

      const endpoint = isStreamer
        ? "http://localhost:8000/api/streamers"
        : "http://localhost:8000/api/youtubers";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Gagal menambahkan data");
      }

      setMessage(
        `${isStreamer ? "Streamer" : "Youtuber"} berhasil ditambahkan!`,
      );

      setName("");
      setCategory("");
      setSubscriber("");
      setViews("");

      onSuccess();

      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
      }, 800);
    } catch (error) {
      console.error(error);

      setMessage(`Gagal menambahkan ${isStreamer ? "streamer" : "youtuber"}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30"
      >
        <span className="text-lg leading-none">+</span>
        Tambah {isStreamer ? "Streamer" : "Youtuber"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {" "}
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Tambah {isStreamer ? "Streamer" : "Youtuber"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Masukkan data untuk menambahkan data baru.
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
                />
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
                    ? "Menambahkan..."
                    : `Tambah ${isStreamer ? "Streamer" : "Youtuber"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
