export function formatExpirationDate(expiresAt: string): string {
  const [year, month] = expiresAt.split('-');
  const twoDigitYear = year.slice(-2);
  return `${month}/${twoDigitYear}`;
}