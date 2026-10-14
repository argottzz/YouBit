"use client";

export default function DataTable({ data, columns }) {
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] px-6 py-12 text-center text-sm text-gray-400">
        Belum ada data. Tambahkan data baru untuk melihatnya di sini.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#181818]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key ?? index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {rows.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="group transition-colors duration-200 hover:bg-red-500/4"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.key ?? columnIndex}
                    className="px-6 py-4 text-sm text-gray-300"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : column.format
                        ? column.format(item[column.key], item)
                        : (item[column.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
