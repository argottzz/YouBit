"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, ShieldCheck, Upload, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import SearchInput from "@/components/common/SearchInput";

export default function MainNavbar() {
  const { user, isLoggedIn, loading, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:gap-6 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="overflow-hidden rounded-lg bg-white p-0.5">
            <Image src="/logo.jpg" alt="VIEWRA" width={34} height={34} priority />
          </span>
          <span className="text-xl font-bold tracking-tight text-ink">
            VIEW<span className="text-primary">RA</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="w-full max-w-xl">
            <SearchInput
              placeholder="Cari video atau channel..."
              onSubmit={(q) =>
                router.push(q ? `/?search=${encodeURIComponent(q)}` : "/")
              }
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {loading ? (
            <span className="text-sm text-muted">Memuat...</span>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/studio/videos/new"
                className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110 sm:inline-flex"
              >
                <Upload size={16} />
                Upload
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary"
                  aria-label="Menu akun"
                >
                  {(user?.username ?? "V").charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-card shadow-xl">
                    <p className="truncate border-b border-line px-4 py-3 text-sm font-semibold text-ink">
                      {user?.username}
                    </p>
                    <Link
                      href="/studio"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted transition hover:bg-secondary hover:text-ink"
                    >
                      <User size={15} /> Channel Saya
                    </Link>
                    <Link
                      href="/studio/channel"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted transition hover:bg-secondary hover:text-ink"
                    >
                      <Settings size={15} /> Pengaturan Channel
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted transition hover:bg-secondary hover:text-ink"
                      >
                        <ShieldCheck size={15} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger transition hover:bg-secondary"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-base transition hover:brightness-110"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchInput
          placeholder="Cari video..."
          onSubmit={(q) =>
            router.push(q ? `/?search=${encodeURIComponent(q)}` : "/")
          }
        />
      </div>
    </header>
  );
}
