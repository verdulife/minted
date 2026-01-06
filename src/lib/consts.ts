export const CRYPTO_CONFIG = {
  ALGORITHM: 'Ed25519',
  FORMAT: 'jwk'
} as const;

export enum SETTINGS_KEYS {
  IDENTITY = 'user_identity',
  THEME = 'app_theme'
}

export enum MINT_STATUS_ISSUER {
  ACTIVE = 'active',
  REDEEMED = 'redeemed'
}

export enum MINT_STATUS_COLLECTOR {
  ACTIVE = 'active',
  USED = 'used'
}

export const EXPIRATION_PRESETS = {
  '24H': 24 * 60 * 60 * 1000,
  '1W': 7 * 24 * 60 * 60 * 1000,
  '1M': 30 * 24 * 60 * 60 * 1000,
  '1Y': 365 * 24 * 60 * 60 * 1000
} as const;
