"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Link from "next/link";

export default function StreamerPage() {
  const [streamers, setStreamers] = useState([]);

  useEffect(() => {
    async function fetchStreamers() {
      const response = await fetch("http://localhost:8000/api/streamers");

      const responseJson = await response.json();

      setStreamers(responseJson.data);
    }

    fetchStreamers();
  }, []);

  const columns = [
    {
      header: "Id",
      Key: "id",
    },
    {
      header: "Nama",
      Key: "namast",
    },
    {
      header: "Kategori",
      Key: "kategorist",
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
            <p className="mb-1 text-sm font-medium text-gray-400">
              Streaming & Creator
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Daftar Streamer
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Lihat daftar streamer populer belakangan ini.
            </p>
          </div>

          <Link
            href="/menu/youtuber"
            className="inline-flex w-fit items-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30"
          >
            Youtuber
          </Link>
        </div>

          <div className="overflow-x-auto">
            <DataTable data={streamers} columns={columns} />
          </div>
        </div>
      </div>
  );
}
