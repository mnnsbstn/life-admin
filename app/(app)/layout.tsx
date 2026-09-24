import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { MobileNav } from "@/components/shell/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar />
      <div className="flex min-h-full flex-1 flex-col pb-16 lg:pb-0">
        <AppHeader />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
