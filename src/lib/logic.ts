import type { IssuerMint, ReceivedMint } from '@/lib/db';

/**
 * Checks if a timestamp (Unix ms) is in the past.
 */
export function isExpired(expiresAt: string): boolean {
  const [year, month] = expiresAt.split('-');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (Number(year) < currentYear) return true;
  if (Number(year) === currentYear && Number(month) < currentMonth) return true;
  return false;
}

/**
 * Business rule to determine if a mint can be deleted from the database.
 * - Received mints can always be deleted (removed from collection).
 * - Issuer mints can only be deleted if they are fully redeemed or expired.
 */
export function canDelete(
  mint: IssuerMint | ReceivedMint,
  context: 'issuer' | 'collection'
): boolean {
  if (context === 'collection') {
    return true; // You can always remove something from your collection
  }

  const issuerMint = mint as IssuerMint;
  const isRedeemed = issuerMint.status === 'redeemed';
  const hasExpired = isExpired(issuerMint.expiresAt);

  return isRedeemed || hasExpired;
}
