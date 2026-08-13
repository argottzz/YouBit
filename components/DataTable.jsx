"use client";

export default function DataTable({ data, columns }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.Key
                  
                }
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td
                  key={column.Key}
                  className="px-6 py-4 text-gray-800"
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
  );
}