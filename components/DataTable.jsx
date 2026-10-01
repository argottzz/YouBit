"use client";

export default function DataTable({ data, columns }) {
  const rows = Array.isArray(data) ? data : [];

  // Dukung key kapital "Key" (lama) maupun "key" (baru),
  // dan custom render via column.render / column.format
  const getKey = (column) => column.key ?? column.Key;
  const getHeader = (column) => column.header ?? column.title ?? getKey(column);

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
              {columns.map((column, index) => {
                const k = getKey(column);
                return (
                  <th
                    key={k ?? index}
                    className={`relative px-6 py-4 text-left text-sm font-semibold text-gray-300 ${
                      index === 0
                        ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-red-600"
                        : ""
                    }`}
                  >
                    {getHeader(column)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {rows.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="group transition-colors duration-200 hover:bg-red-500/4"
              >
                {columns.map((column, columnIndex) => {
                  const k = getKey(column);
                  const value = item[k];
                  return (
                    <td
                      key={k ?? columnIndex}
                      className={`px-6 py-4 text-sm text-gray-300 ${
                        columnIndex === 0
                          ? "font-semibold text-white group-hover:text-red-400"
                          : ""
                      }`}
                    >
                      {column.render
                        ? column.render(value, item)
                        : column.format
                          ? column.format(value, item)
                          : (value ?? "-")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
