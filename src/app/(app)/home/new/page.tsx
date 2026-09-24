import type { Metadata } from "next";

import { AddPlaceholder } from "@/components/shell/add-placeholder";

export const metadata: Metadata = {
  title: "Home Item anlegen",
};

export default function NewHomeItemPage() {
  return (
    <AddPlaceholder title="Home Item anlegen" backHref="/home" />
  );
}
