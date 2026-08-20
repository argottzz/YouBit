"use client";

export default function DataTable({ data, columns }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#181818]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.Key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-white/4"
              >
                {columns.map((column) => (
                  <td
                    key={column.Key}
                    className="px-6 py-4 text-sm text-gray-300"
                  >
                    {column.format
                      ? column.format(item[column.Key])
                      : item[column.Key]}
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