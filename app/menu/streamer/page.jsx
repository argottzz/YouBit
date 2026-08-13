"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Link from "next/link";

export default function StreamerPage() {
  const [streamers, setStreamers] = useState([]);

  useEffect(() => {
    async function fetchStreamers() {
      const response = await fetch("http://localhost:8000/api/streamer");

      const responseJson = await response.json();

      setStreamers(responseJson.data);
    }

    fetchStreamers();
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
        <h1 className="mb-6 text-2xl font-bold">Daftar Streamer</h1>

        <DataTable data={streamers} columns={columns} />

        <div className="mt-4">
          <Link
            href="/menu/youtuber"
            className="inline-flex items-center rounded-3xl bg-red-600 px-4 py-2 text-white transition hover:bg-gray-700"
          >
            Youtuber
          </Link>
        </div>
      </div>
    </div>
  );
}
