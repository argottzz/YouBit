"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Link from "next/link";

export default function StreamerPage() {
  const [youtubers, setYoutubers] = useState([]);

  useEffect(() => {
    async function fetchYoutubers() {
      try {
        const response = await fetch("http://localhost:8000/api/youtubers");

        const responseJson = await response.json();

        setYoutubers(responseJson.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    }

    fetchYoutubers();
  }, []);

  const columns = [
    {
      header: "Id",
      Key: "id",
    },
    {
      header: "Nama",
      Key: "namayt",
    },
    {
      header: "Kategori",
      Key: "kategoriyt",
    },
    {
      header: "Subscriber",
      Key: "subscriber",
      format: (value) => value.toLocaleString("id-ID"),
    },
    {
      header: "Views",
      Key: "views",
      format: (value) => value.toLocaleString("id-ID"),
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Daftar Youtuber
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Lihat daftar youtuber populer belakangan ini.
            </p>
          </div>

          <Link
            href="/menu/streamer"
            className="inline-flex w-fit items-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30"
          >
            Streamer
          </Link>
        </div>

        <div className="overflow-x-auto">
          <DataTable data={youtubers} columns={columns} />
        </div>
      </div>
    </div>
  );
}
