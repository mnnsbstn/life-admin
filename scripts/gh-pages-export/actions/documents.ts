async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createDocumentAction(_formData: FormData) {
  return blocked();
}

export async function updateDocumentAction(_id: string, _formData: FormData) {
  return blocked();
}

export async function deleteDocumentAction(_id: string) {
  return blocked();
}
