"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import CategoryFilter from "@/components/common/CategoryFilter";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/states";
import VideoGrid from "@/components/video/VideoGrid";
import { ApiError, videoApi } from "@/lib/api";
import type { Pagination, Video } from "@/types/video";

const PAGE_SIZE = 12;

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [prevQuery, setPrevQuery] = useState(`${search}|${category}`);

  // Reset ke halaman 1 saat query berubah (pola render-time adjustment,
  // bukan setState di dalam effect).
  if (prevQuery !== `${search}|${category}`) {
    setPrevQuery(`${search}|${category}`);
    setPage(1);
  }
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await videoApi.listPublic({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setVideos(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal memuat video. Pastikan backend berjalan.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    void Promise.resolve().then(fetchVideos);
  }, [fetchVideos]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const v of videos) {
      if (v.category) set.add(v.category);
    }
    return [...set].sort();
  }, [videos]);

  return (
    <AppShell>
      <section className="mb-8 rounded-2xl border border-line bg-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Your View. Your World.
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
          Jelajahi video kreator favoritmu
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Temukan video terbaru, kunjungi channel kreator, dan kelola channel
          serta videomu sendiri melalui Creator Studio.
        </p>
      </section>

      <div className="mb-5">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      </div>

      {search && (
        <p className="mb-4 text-sm text-muted">
          Hasil pencarian untuk <span className="font-semibold text-ink">“{search}”</span>
        </p>
      )}

      {loading ? (
        <LoadingState message="Memuat video..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchVideos} />
      ) : videos.length === 0 ? (
        <EmptyState
          title="Belum ada video"
          message="Coba kata kunci atau kategori lain."
        />
      ) : (
        <>
          <VideoGrid videos={videos} />
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-muted">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState message="Memuat..." />}>
      <HomeContent />
    </Suspense>
  );
}
