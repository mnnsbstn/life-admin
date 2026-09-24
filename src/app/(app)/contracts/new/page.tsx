import type { Metadata } from "next";

import { AddPlaceholder } from "@/components/shell/add-placeholder";

export const metadata: Metadata = {
  title: "Vertrag anlegen",
};

export default function NewContractPage() {
  return <AddPlaceholder title="Vertrag anlegen" backHref="/contracts" />;
}
