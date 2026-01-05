import { db } from '@/lib/db';
import { identity, isInitialized } from '@/lib/stores';
import { generateIdentityKeys } from '@/lib/crypto';
import { SETTINGS_KEYS } from '@/lib/consts';

export async function initAuth() {
  try {
    const identitySetting = await db.settings.get(SETTINGS_KEYS.IDENTITY);

    if (identitySetting && identitySetting.id === SETTINGS_KEYS.IDENTITY) {
      identity.set(identitySetting.value);
    } else {
      const newKeys = await generateIdentityKeys();

      await db.settings.add({
        id: SETTINGS_KEYS.IDENTITY,
        value: newKeys,
        createdAt: Date.now()
      });

      identity.set(newKeys);
    }
  } catch (error) {
    console.error("Error inicializando la identidad:", error);
  } finally {
    isInitialized.set(true);
  }
}