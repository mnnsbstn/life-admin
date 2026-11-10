"use client";

import { ContractForm } from "@/features/contracts/components/contract-form";
import type { ContractFormValues } from "@/features/contracts/schemas/contract.schema";
import { useSmartCapturePrefill } from "@/lib/smart-capture/use-smart-capture-prefill";
import { SMART_CAPTURE_SESSION_KEYS } from "@/lib/smart-capture/types";

interface ContractFormNewClientProps {
  defaultValues: ContractFormValues;
}

export function ContractFormNewClient(props: ContractFormNewClientProps) {
  const { values, ready } = useSmartCapturePrefill(
    SMART_CAPTURE_SESSION_KEYS.contract,
    props.defaultValues,
  );

  if (!ready) return null;

  return <ContractForm defaultValues={values} />;
}
