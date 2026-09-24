import type {
  Contract,
  Document,
  DocumentLinkTarget,
  HomeItem,
  Reminder,
  ReminderLink,
} from "@/lib/domain/types";

export interface ResolvedLink {
  label: string;
  href?: string;
}

export function resolveDocumentLink(
  link: DocumentLinkTarget,
  homeItems: HomeItem[],
  contracts: Contract[],
): ResolvedLink {
  if (link.type === "none") {
    return { label: "Keine Verknüpfung" };
  }
  if (link.type === "home_item") {
    const item = homeItems.find((h) => h.id === link.id);
    return item
      ? { label: item.name, href: `/home/${item.id}` }
      : { label: "Home Item" };
  }
  const contract = contracts.find((c) => c.id === link.id);
  return contract
    ? { label: contract.name, href: `/contracts/${contract.id}` }
    : { label: "Vertrag" };
}

export function resolveReminderLink(
  link: ReminderLink,
  homeItems: HomeItem[],
  contracts: Contract[],
): ResolvedLink {
  if (link.type === "standalone") {
    return { label: "Allgemein" };
  }
  if (link.type === "home_item") {
    const item = homeItems.find((h) => h.id === link.id);
    return item
      ? { label: item.name, href: `/home/${item.id}` }
      : { label: "Home Item" };
  }
  const contract = contracts.find((c) => c.id === link.id);
  return contract
    ? { label: contract.name, href: `/contracts/${contract.id}` }
    : { label: "Vertrag" };
}

export function documentsForHomeItem(
  documents: Document[],
  homeItemId: string,
): Document[] {
  return documents.filter(
    (d) => d.link.type === "home_item" && d.link.id === homeItemId,
  );
}

export function documentsForContract(
  documents: Document[],
  contractId: string,
): Document[] {
  return documents.filter(
    (d) => d.link.type === "contract" && d.link.id === contractId,
  );
}

export function remindersForHomeItem(
  reminders: Reminder[],
  homeItemId: string,
): Reminder[] {
  return reminders.filter(
    (r) => r.link.type === "home_item" && r.link.id === homeItemId,
  );
}

export function remindersForContract(
  reminders: Reminder[],
  contractId: string,
): Reminder[] {
  return reminders.filter(
    (r) => r.link.type === "contract" && r.link.id === contractId,
  );
}
