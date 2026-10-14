"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoadingState } from "@/components/common/states";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (adminOnly && !isAdmin) {
      router.push("/");
    }
  }, [loading, isLoggedIn, isAdmin, adminOnly, router]);

  if (loading || !isLoggedIn || (adminOnly && !isAdmin)) {
    return (
      <div className="min-h-screen bg-base px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <LoadingState message="Memeriksa sesi..." />
        </div>
      </div>
    );
  }

  void user;
  return <>{children}</>;
}
