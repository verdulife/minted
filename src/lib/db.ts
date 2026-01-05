import Dexie, { type Table } from 'dexie';
import { SETTINGS_KEYS } from '@/lib/consts';

export interface UserIdentity {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export type SettingValue =
  | { id: SETTINGS_KEYS.IDENTITY; value: UserIdentity; createdAt: number }
  | { id: 'last_sync'; value: Date; createdAt: number };

export interface Card {
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
  used: boolean;
}

export class AppDatabase extends Dexie {
  settings!: Table<SettingValue, string>;
  myCards!: Table<Card, string>;
  receivedCards!: Table<Card, string>;

  constructor() {
    super('MintedDB');

    this.version(1).stores({
      settings: 'id',
      myCards: 'id, createdAt, used',
      receivedCards: 'id, issuerPublicKey, createdAt, used'
    });
  }

  static async resetDatabase() {
    await db.delete();
    window.location.reload();
  }
}

export const db = new AppDatabase();