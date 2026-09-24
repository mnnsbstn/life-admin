import { ContractForm } from "@/components/contracts/contract-form";
import { createContractAction } from "@/lib/actions/contracts";

export default function NewContractPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Add a utility, insurance, or subscription.</p>
      <ContractForm action={createContractAction} submitLabel="Create contract" />
    </div>
  );
}
