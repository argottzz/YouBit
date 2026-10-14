"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 px-8 py-4 bg-[#0F0F0F] border-b border-gray-700">
      <Link href="/" className="text-2xl font-bold text-white">
        You<span className="text-red-600">Bit</span>
      </Link>

      {isLoggedIn && (
        <div className="flex items-center gap-2 text-sm">
          <Link href="/menu/streamer" className="px-3 py-2 text-gray-300 hover:text-white">
            Streamer
          </Link>
          <Link href="/menu/youtuber" className="px-3 py-2 text-gray-300 hover:text-white">
            Youtuber
          </Link>
          {isAdmin && (
            <Link href="/menu/users" className="px-3 py-2 text-gray-300 hover:text-white">
              Users
            </Link>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-sm text-gray-500">Memuat...</span>
        ) : isLoggedIn ? (
          <>
            <span className="hidden sm:block text-sm text-gray-300">
              Halo, <span className="font-semibold text-white">{user?.username ?? user?.email}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-700 rounded-3xl hover:bg-red-600 hover:border-red-600 cursor-pointer text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 border border-gray-700 rounded-3xl hover:bg-[#263850] text-white"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
