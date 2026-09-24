import { notFound } from "next/navigation";
import { ContractForm } from "@/components/contracts/contract-form";
import { updateContractAction } from "@/lib/actions/contracts";
import { getDemoContext } from "@/lib/data/demo-context";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditContractPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const contract = repos.contracts.getById(id);
  if (!contract || contract.householdId !== householdId) notFound();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Update {contract.name}.</p>
      <ContractForm
        contract={contract}
        action={updateContractAction.bind(null, id)}
        submitLabel="Save changes"
      />
    </div>
  );
}
