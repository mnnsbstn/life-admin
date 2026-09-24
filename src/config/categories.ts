import type { ContractCategory, HomeItemCategory } from "@/lib/domain/types";

export const homeItemCategoryLabels: Record<HomeItemCategory, string> = {
  heating: "Heizung",
  electricity: "Strom",
  water: "Wasser",
  internet: "Internet",
  appliances: "Geräte",
  kitchen: "Küche",
  bathroom: "Bad",
  smart_home: "Smart Home",
  garden: "Garten",
  renovation: "Renovierung",
  other: "Sonstiges",
};

export const contractCategoryLabels: Record<ContractCategory, string> = {
  electricity: "Strom",
  internet: "Internet",
  mobile: "Mobilfunk",
  insurance: "Versicherung",
  streaming: "Streaming",
  membership: "Mitgliedschaft",
  software: "Software",
  other: "Sonstiges",
};
