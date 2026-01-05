export const CRYPTO_CONFIG = {
  ALGORITHM: 'Ed25519',
  FORMAT: 'jwk'
} as const;

export enum SETTINGS_KEYS {
  IDENTITY = 'user_identity',
  THEME = 'app_theme'
}

export enum CARD_RARITIES {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary'
};

export enum CARD_EFFECTS {
  STANDARD = 'standard',
  HOLOGRAPHIC = 'holographic',
  GOLD = 'gold'
};