"use client";

import { useEffect, useState } from "react";

export default function StreamerPage() {
  const [youtubers, setYoutbers] = useState([]);

  useEffect(() => {
    async function fetchYoutubers() {
      const response = await fetch("http://localhost:8000/api/youtuber");

      const responseJson = await response.json();

      setYoutbers(responseJson.data);
    }

    fetchYoutubers();
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
              </tr>
            </thead>

            <tbody>
              {youtubers.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-800">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.category}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {item.subscriber.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}