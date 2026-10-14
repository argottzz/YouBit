"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Compass,
  History,
  Home,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const mainLinks = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/?explore=1", label: "Explore", icon: Compass },
];

const placeholderLinks = [
  { label: "Subscriptions", icon: Users },
  { label: "Library", icon: Bookmark },
  { label: "History", icon: History },
];

export default function MainSidebar() {
  const pathname = usePathname();
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-line bg-sidebar px-3 py-5 md:block">
      <nav className="space-y-1">
        {mainLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-secondary text-primary"
                  : "text-muted hover:bg-secondary hover:text-ink"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Koleksi
      </p>
      <div className="space-y-1">
        {placeholderLinks.map(({ label, icon: Icon }) => (
          <span
            key={label}
            title="Segera hadir"
            className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted/60"
          >
            <Icon size={18} />
            {label}
            <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted">
              Segera
            </span>
          </span>
        ))}
      </div>

      {isLoggedIn && (
        <>
          <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Kreator
          </p>
          <nav className="space-y-1">
            <Link
              href="/studio"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                pathname.startsWith("/studio")
                  ? "bg-secondary text-primary"
                  : "text-muted hover:bg-secondary hover:text-ink"
              }`}
            >
              <Wrench size={18} />
              Creator Studio
            </Link>
            <Link
              href="/studio/channel"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-secondary hover:text-ink"
            >
              <User size={18} />
              My Channel
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  pathname.startsWith("/admin")
                    ? "bg-secondary text-primary"
                    : "text-muted hover:bg-secondary hover:text-ink"
                }`}
              >
                <ShieldCheck size={18} />
                Admin
              </Link>
            )}
          </nav>
        </>
      )}
    </aside>
  );
}
