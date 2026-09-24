import { revalidatePath } from "next/cache";

export function revalidateLifeAdminCore() {
  revalidatePath("/today");
  revalidatePath("/home", "layout");
  revalidatePath("/contracts", "layout");
  revalidatePath("/documents", "layout");
  revalidatePath("/reminders", "layout");
}
