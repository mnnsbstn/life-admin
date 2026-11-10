import type { FamilyMember } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";

export function getFamilyMemberSubtitle(member: FamilyMember): string | undefined {
  return member.email ?? member.phone;
}

export function getFamilyMemberListMeta(member: FamilyMember): string | undefined {
  if (member.phone && member.email) return member.phone;
  if (member.birthday) return formatDisplayDate(member.birthday);
  return member.phone ?? member.email;
}
