import type { ContractFormValues } from "@/features/contracts/schemas/contract.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createContractAction(_values: ContractFormValues) {
  return blocked();
}

export async function updateContractAction(
  _id: string,
  _values: ContractFormValues,
) {
  return blocked();
}

export async function deleteContractAction(_id: string) {
  return blocked();
}
