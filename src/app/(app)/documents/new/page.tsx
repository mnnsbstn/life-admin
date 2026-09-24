import { ModuleStatus } from "@/components/shared/module-status";

export default function NewDocumentPage() {
  return (
    <ModuleStatus
      title="Add document"
      description="Form coming in Step 8."
      countLabel="Draft"
      count={0}
    />
  );
}
