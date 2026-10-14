"use client";

import Link from "next/link";
import { Compass, Home, PlusCircle, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function MobileNavigation() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-sidebar px-2 py-2 md:hidden">
      <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted">
        <Home size={20} />
        Home
      </Link>
      <Link
        href="/?explore=1"
        className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted"
      >
        <Compass size={20} />
        Explore
      </Link>
      {isLoggedIn && (
        <>
          <Link
            href="/studio/videos/new"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted"
          >
            <PlusCircle size={20} />
            Upload
          </Link>
          <Link
            href="/studio"
            className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted"
          >
            <Wrench size={20} />
            Studio
          </Link>
        </>
      )}
    </nav>
  );
}
