"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { User } from "@/types/user";

export default function UserTable({
  users,
  currentUserId,
  onRoleChange,
  onDelete,
  busyId,
}: {
  users: User[];
  currentUserId: number;
  onRoleChange: (id: number, role: "admin" | "user") => void;
  onDelete: (id: number) => void;
  busyId: number | null;
}) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[560px]">
          <thead className="bg-secondary">
            <tr>
              {["Username", "Email", "Role", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 text-sm font-medium text-ink">
                  {u.username}
                  {u.id === currentUserId && (
                    <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Kamu
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-sm text-muted">{u.email}</td>
                <td className="px-5 py-3">
                  <select
                    value={u.role}
                    disabled={u.id === currentUserId || busyId === u.id}
                    onChange={(e) =>
                      onRoleChange(u.id, e.target.value as "admin" | "user")
                    }
                    className="rounded-lg border border-line bg-secondary px-2 py-1.5 text-sm text-ink outline-none focus:border-primary disabled:opacity-50"
                    aria-label={`Role ${u.username}`}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setDeleteId(u.id)}
                    disabled={busyId === u.id}
                    className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-base transition hover:brightness-110 disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus pengguna?"
        message="Pengguna yang dihapus tidak dapat dikembalikan."
        loading={busyId !== null}
        onConfirm={() => {
          if (deleteId !== null) {
            onDelete(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
