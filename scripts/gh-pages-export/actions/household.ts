async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function updateHouseholdNameAction(_formData: FormData) {
  return blocked();
}

export async function createHouseholdInvitationAction(_formData: FormData) {
  return blocked();
}

export async function revokeHouseholdInvitationAction(_invitationId: string) {
  return blocked();
}

export async function acceptHouseholdInvitationAction(_token: string) {
  return blocked();
}
