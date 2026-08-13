"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";


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

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="mb-6 text-2xl font-bold">
          Daftar Streamer
        </h1>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Kategori
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Subscriber
                </th>
              </tr>
            </thead>

            <tbody>
              {streamers.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-800">{item.name}</td>

                  <td className="px-6 py-4 text-gray-600">{item.category}</td>

                  <td className="px-6 py-4 text-gray-800">
                    {item.subscriber.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
