"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Aksi
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

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                        Edit
                      </button>

                      <button className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Link href="/menu/youtuber">
        <button className="flex items-center px-4 py-2 border border-gray-700 rounded-3xl hover:bg-[#263850] cursor-pointer text-white">
          Login
        </button>
      </Link>
    </div>
  );
}
