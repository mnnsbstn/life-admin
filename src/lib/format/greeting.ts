export function getTimeGreeting(
  displayName: string,
  referenceDate: Date = new Date(),
): string {
  const hour = referenceDate.getHours();

  let salutation = "Guten Abend";
  if (hour >= 5 && hour < 12) {
    salutation = "Guten Morgen";
  } else if (hour >= 12 && hour < 18) {
    salutation = "Guten Tag";
  }

  return `${salutation}, ${displayName}.`;
}
