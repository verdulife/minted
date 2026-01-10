import type { Mint, ReceivedMint } from '@/lib/db';

/**
 * Dictionary mapping long keys to short unique characters
 */
const KEY_MAP: Record<string, string> = {
  id: 'i',
  title: 't',
  description: 'd',
  visualConfig: 'v',
  effect: 'f', // nested in visualConfig
  color: 'l',  // nested in visualConfig
  issuerPublicKey: 'k',
  signature: 's',
  createdAt: 'c',
  expiresAt: 'e',
  totalUnits: 'u',
  usedUnits: 'n',
  status: 'h'
};

const REVERSE_MAP: Record<string, string> = Object.entries(KEY_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

/**
 * Compresses a mint object into a string for QR generation
 */
export function encodeMint(mint: Mint): string {
  const compressed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(mint)) {
    const shortKey = KEY_MAP[key] || key;

    if (key === 'visualConfig' && typeof value === 'object' && value !== null) {
      const compressedConfig: Record<string, unknown> = {};
      for (const [vKey, vValue] of Object.entries(value)) {
        compressedConfig[KEY_MAP[vKey] || vKey] = vValue;
      }
      compressed[shortKey] = compressedConfig;
    } else {
      compressed[shortKey] = value;
    }
  }

  return JSON.stringify(compressed);
}

/**
 * Decompresses a string from a QR code back into a Mint object
 */
export function decodeMint(encoded: string): ReceivedMint {
  const url = new URL(encoded);
  const base64Data = url.searchParams.get('m');
  const data = base64Data ? JSON.parse(atob(base64Data)) : null;
  const decompressed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const longKey = REVERSE_MAP[key] || key;

    if (longKey === 'visualConfig' && typeof value === 'object' && value !== null) {
      const config: Record<string, unknown> = {};
      for (const [vKey, vValue] of Object.entries(value)) {
        config[REVERSE_MAP[vKey] || vKey] = vValue;
      }
      decompressed[longKey] = config;
    } else {
      decompressed[longKey] = value;
    }
  }

  return decompressed as unknown as ReceivedMint;
}

/**
 * Simple helper to detect if a string is a compressed mint
 */
export function isCompressedMint(encoded: string): boolean {
  try {
    const data = JSON.parse(encoded);
    // If it has 'i' (id) and 's' (signature) but not 'id' or 'signature'
    return !!data.i && !!data.s && !data.id && !data.signature;
  } catch {
    return false;
  }
}
