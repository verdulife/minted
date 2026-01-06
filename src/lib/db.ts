import Dexie, { type Table } from 'dexie';
import { SETTINGS_KEYS } from '@/lib/consts';

export interface UserIdentity {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export type SettingValue =
  | { id: SETTINGS_KEYS.IDENTITY; value: UserIdentity; createdAt: number }
  | { id: 'last_sync'; value: Date; createdAt: number };

// Base common fields for both types of mints
export interface MintBase {
  id: string;
  title: string;
  description: string;
  visualConfig: {
    effect: 'plastic' | 'metalized' | 'holographic' | 'mirror';
    color: string;
  };
  issuerPublicKey: JsonWebKey;
  signature: string;
  createdAt: number;
  expiresAt: number;
}

// Mint issued by the user (owner/issuer)
export interface IssuerMint extends MintBase {
  status: 'active' | 'redeemed';
  totalUnits: number;
  usedUnits: number;
}

// Mint received/collected by the user
export interface ReceivedMint extends MintBase {
  status: 'active' | 'used';
}

// Convenience type for components handling both
export type Mint = IssuerMint | ReceivedMint;

// Legacy alias to avoid breaking everything at once
export type Card = Mint;

export class AppDatabase extends Dexie {
  settings!: Table<SettingValue, string>;
  myMints!: Table<IssuerMint, string>;
  collection!: Table<ReceivedMint, string>;

  constructor() {
    super('MintedDB');

    this.version(2).stores({
      settings: 'id',
      myMints: 'id, createdAt, expiresAt, status',
      collection: 'id, issuerPublicKey, createdAt, expiresAt, status'
    });
  }

  static async resetDatabase() {
    await db.delete();
    window.location.reload();
  }
}

export const db = new AppDatabase();