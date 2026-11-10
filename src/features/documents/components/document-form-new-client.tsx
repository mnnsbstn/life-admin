"use client";

import { DocumentForm } from "@/features/documents/components/document-form";
import type { DocumentFormValues } from "@/features/documents/schemas/document.schema";
import { useSmartCapturePrefill } from "@/lib/smart-capture/use-smart-capture-prefill";
import { SMART_CAPTURE_SESSION_KEYS } from "@/lib/smart-capture/types";
import type { Contract, HomeItem } from "@/lib/domain/types";

interface DocumentFormNewClientProps {
  defaultValues: DocumentFormValues;
  homeItems: HomeItem[];
  contracts: Contract[];
}

export function DocumentFormNewClient(props: DocumentFormNewClientProps) {
  const { values, ready } = useSmartCapturePrefill(
    SMART_CAPTURE_SESSION_KEYS.document,
    props.defaultValues,
  );

  if (!ready) return null;

  return (
    <DocumentForm
      defaultValues={values}
      homeItems={props.homeItems}
      contracts={props.contracts}
    />
  );
}
