"use client";

import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { MobileNav } from "@/components/shell/mobile-nav";
import { PageContainer } from "@/components/shell/page-container";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[oklch(0.985_0.002_260)]">
      <AppSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <PageContainer>{children}</PageContainer>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
