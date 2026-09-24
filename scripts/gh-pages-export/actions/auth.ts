async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function signInAction(_formData: FormData) {
  return blocked();
}

export async function signUpAction(_formData: FormData) {
  return blocked();
}

export async function signOutAction() {
  return blocked();
}
