export interface ShareEmailInput {
  subject: string;
  bodyLines: string[];
}

/** `mailto:` draft — inbox paste or share with household (no server send). */
export function buildShareMailtoUrl(input: ShareEmailInput): string {
  const body = input.bodyLines.filter(Boolean).join("\n");
  const params = new URLSearchParams();
  params.set("subject", input.subject);
  if (body) params.set("body", body);
  return `mailto:?${params.toString()}`;
}
