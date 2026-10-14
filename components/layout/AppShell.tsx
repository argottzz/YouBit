import type { ReactNode } from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import MainSidebar from "@/components/layout/MainSidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-base text-ink">
      <MainNavbar />
      <div className="mx-auto flex max-w-[1400px]">
        <MainSidebar />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-12 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
