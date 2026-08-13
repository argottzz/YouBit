"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Link from "next/link";

export default function StreamerPage() {
  const [youtubers, setYoutubers] = useState([]);

  useEffect(() => {
    async function fetchYoutubers() {
      const response = await fetch("http://localhost:8000/api/youtuber");

      const responseJson = await response.json();

      setYoutubers(responseJson.data);
    }

    fetchYoutubers();
  }, []);

  const columns = [
    {
      header: "Nama",
      Key: "name",
    },
    {
      header: "Kategori",
      Key: "category",
    },
    {
      header: "Subscriber",
      Key: "subscriber",
      format: (value) => value.toLocaleString("id-ID"),
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="mb-6 text-2xl font-bold">Daftar Youtuber</h1>

        <DataTable data={youtubers} columns={columns} />

        <div className="mt-4">
          <Link
            href="/menu/streamer"
            className="inline-flex items-center rounded-3xl bg-red-600 px-4 py-2 text-white transition hover:bg-gray-700"
          >
            Streamer
          </Link>
        </div>
      </div>
    </div>
  );
}
