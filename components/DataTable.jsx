"use client";

export default function DataTable({ data, columns }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#181818]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.Key}
                  className={`relative px-6 py-4 text-left text-sm font-semibold text-gray-300 ${
                    index === 0
                      ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-red-600"
                      : ""
                  }`}
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
                className="group transition-colors duration-200 hover:bg-red-500/[0.04]"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.Key}
                    className={`px-6 py-4 text-sm text-gray-300 ${
                      columnIndex === 0
                        ? "font-semibold text-white group-hover:text-red-400"
                        : ""
                    }`}
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