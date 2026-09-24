import { DevAppFrame } from "@/components/layout/dev-app-frame";
import { AppProviders } from "@/providers/app-providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <DevAppFrame>{children}</DevAppFrame>
    </AppProviders>
  );
}
