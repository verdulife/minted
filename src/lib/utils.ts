export function formatExpirationDate(expiresAt: number): string {
  const date = new Date(expiresAt);

  return new Intl.DateTimeFormat("en", {
    year: '2-digit',
    month: '2-digit',
  }).format(date);
}