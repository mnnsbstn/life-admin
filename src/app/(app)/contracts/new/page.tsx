import type { Metadata } from "next";

import { ContractForm } from "@/features/contracts/components/contract-form";
import { emptyContractFormValues } from "@/features/contracts/lib/map-form";

export const metadata: Metadata = {
  title: "Vertrag anlegen",
};

export default function NewContractPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Vertrag anlegen</h1>
      <ContractForm defaultValues={emptyContractFormValues} />
    </div>
  );
}
