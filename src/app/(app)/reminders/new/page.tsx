import type { Metadata } from "next";

import { AddPlaceholder } from "@/components/shell/add-placeholder";

export const metadata: Metadata = {
  title: "Erinnerung anlegen",
};

export default function NewReminderPage() {
  return (
    <AddPlaceholder title="Erinnerung anlegen" backHref="/reminders" />
  );
}
