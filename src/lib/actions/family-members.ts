"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  familyMemberSchema,
  type FamilyMemberFormValues,
} from "@/features/family/schemas/family-member.schema";
import { emptyToUndefined } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toEntity(values: FamilyMemberFormValues, householdId: string) {
  return {
    householdId,
    name: values.name,
    relationship: values.relationship,
    email: emptyToUndefined(values.email),
    phone: emptyToUndefined(values.phone),
    birthday: emptyToUndefined(values.birthday),
    notes: emptyToUndefined(values.notes),
  };
}

export async function createFamilyMemberAction(values: FamilyMemberFormValues) {
  const parsed = familyMemberSchema.parse(values);
  const { householdId } = await getAppSession();
  const created = await getRepositories().familyMembers.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/family/${created.id}`);
}

export async function updateFamilyMemberAction(
  id: string,
  values: FamilyMemberFormValues,
) {
  const parsed = familyMemberSchema.parse(values);
  await getRepositories().familyMembers.update(
    id,
    toEntity(parsed, (await getAppSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/family/${id}`);
}

export async function deleteFamilyMemberAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.familyMembers.getById(entityId),
    id,
    householdId,
  );
  await repos.familyMembers.delete(id);
  revalidateLifeAdminCore();
  redirect("/family");
}
