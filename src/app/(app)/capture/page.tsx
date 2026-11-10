import type { Metadata } from "next";

import { SmartCaptureView } from "@/features/capture/components/smart-capture-view";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { smartCaptureModeLabel } from "@/lib/smart-capture/parse";

export const metadata: Metadata = {
  title: "Smart Capture",
};

export default function CapturePage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/today" />;
  }

  return <SmartCaptureView mode={smartCaptureModeLabel()} />;
}
