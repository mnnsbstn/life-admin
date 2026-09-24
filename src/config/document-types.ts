import type { DocumentType } from "@/lib/domain/types";

export const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Rechnung",
  contract: "Vertrag",
  manual: "Anleitung",
  warranty: "Garantie",
  insurance: "Versicherung",
  certificate: "Zertifikat",
  receipt: "Beleg",
  other: "Sonstiges",
};

export const documentTypeOptions = Object.entries(documentTypeLabels).map(
  ([value, label]) => ({ value: value as DocumentType, label }),
);
