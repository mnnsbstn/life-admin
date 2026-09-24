import type {
  ContractCategory,
  DocumentType,
  HomeCategory,
} from "@/lib/domain/types";

export const homeCategoryLabels: Record<HomeCategory, string> = {
  heating: "Heating",
  electricity: "Electricity",
  water: "Water",
  internet: "Internet",
  appliances: "Appliances",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  smart_home: "Smart Home",
  garden: "Garden",
  renovation: "Renovation",
  other: "Other",
};

export const contractCategoryLabels: Record<ContractCategory, string> = {
  electricity: "Electricity",
  internet: "Internet",
  mobile: "Mobile",
  insurance: "Insurance",
  streaming: "Streaming",
  membership: "Membership",
  software: "Software",
  other: "Other",
};

export const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Invoice",
  contract: "Contract",
  manual: "Manual",
  warranty: "Warranty",
  insurance: "Insurance",
  certificate: "Certificate",
  receipt: "Receipt",
  other: "Other",
};
