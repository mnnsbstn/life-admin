import type { HomeItemFormValues } from "@/features/home/schemas/home-item.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createHomeItemAction(_values: HomeItemFormValues) {
  return blocked();
}

export async function updateHomeItemAction(
  _id: string,
  _values: HomeItemFormValues,
) {
  return blocked();
}

export async function deleteHomeItemAction(_id: string) {
  return blocked();
}
