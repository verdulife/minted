import { type UserIdentity, type Card, db } from '@/lib/db';
import { CRYPTO_CONFIG } from '@/lib/consts';

/**
 * Genera un par de llaves Ed25519 para la identidad del usuario
 */
export async function generateIdentityKeys(): Promise<UserIdentity> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: CRYPTO_CONFIG.ALGORITHM
    },
    true,
    ['sign', 'verify']
  );

  const publicKey = await window.crypto.subtle.exportKey(CRYPTO_CONFIG.FORMAT, keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey(CRYPTO_CONFIG.FORMAT, keyPair.privateKey);

  return { publicKey, privateKey };
}

/**
 * Convierte un objeto a ArrayBuffer para poder firmarlo
 */
function objectToArrayBuffer(obj: unknown): ArrayBuffer {
  const jsonString = JSON.stringify(obj);
  const encoder = new TextEncoder();

  return encoder.encode(jsonString).buffer;
}

/**
 * Convierte un ArrayBuffer a string Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

/**
 * Convierte un string Base64 a ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Firma los datos de una carta con la clave privada del usuario
 */
export async function signCardData(
  cardData: Omit<Card, 'signature'>,
  privateKey: JsonWebKey
): Promise<string> {
  // Importar la clave privada
  const cryptoKey = await window.crypto.subtle.importKey(
    CRYPTO_CONFIG.FORMAT,
    privateKey,
    {
      name: CRYPTO_CONFIG.ALGORITHM
    },
    false,
    ['sign']
  );

  // Crear el payload a firmar (sin la firma misma)
  const payload = {
    id: cardData.id,
    title: cardData.title,
    description: cardData.description,
    visualConfig: cardData.visualConfig,
    issuerPublicKey: cardData.issuerPublicKey,
    createdAt: cardData.createdAt,
    used: cardData.used
  };

  // Firmar el payload
  const dataBuffer = objectToArrayBuffer(payload);
  const signatureBuffer = await window.crypto.subtle.sign(
    CRYPTO_CONFIG.ALGORITHM,
    cryptoKey,
    dataBuffer
  );

  // Convertir la firma a Base64
  return arrayBufferToBase64(signatureBuffer);
}

/**
 * Verifica la firma de una carta usando la clave pública del emisor
 */
export async function verifyCardSignature(card: Card): Promise<boolean> {
  try {
    // Importar la clave pública
    const cryptoKey = await window.crypto.subtle.importKey(
      CRYPTO_CONFIG.FORMAT,
      card.issuerPublicKey,
      {
        name: CRYPTO_CONFIG.ALGORITHM
      },
      false,
      ['verify']
    );

    // Reconstruir el payload original (sin la firma)
    const payload = {
      id: card.id,
      title: card.title,
      description: card.description,
      visualConfig: card.visualConfig,
      issuerPublicKey: card.issuerPublicKey,
      createdAt: card.createdAt,
      used: card.used
    };

    // Convertir datos y firma
    const dataBuffer = objectToArrayBuffer(payload);
    const signatureBuffer = base64ToArrayBuffer(card.signature);

    // Verificar la firma
    const isValid = await window.crypto.subtle.verify(
      CRYPTO_CONFIG.ALGORITHM,
      cryptoKey,
      signatureBuffer,
      dataBuffer
    );

    return isValid;
  } catch (error) {
    console.error('Error verificando firma:', error);
    return false;
  }
}

/**
 * Crea una carta completa, la firma y la guarda en la base de datos
 */
export async function createAndMintCard(
  identity: UserIdentity,
  cardInput: {
    title: string;
    description: string;
    visualConfig: {
      rarity: 'common' | 'rare' | 'legendary';
      effect: 'standard' | 'holographic' | 'gold';
      color: string;
      image?: string;
    };
  }
): Promise<Card> {
  // Generar ID único
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  // Crear la carta sin firma
  const unsignedCard: Omit<Card, 'signature'> = {
    id,
    title: cardInput.title,
    description: cardInput.description,
    visualConfig: cardInput.visualConfig,
    issuerPublicKey: identity.publicKey,
    createdAt,
    used: false
  };

  // Firmar la carta
  const signature = await signCardData(unsignedCard, identity.privateKey);

  // Carta completa con firma
  const signedCard: Card = {
    ...unsignedCard,
    signature
  };

  // Guardar en la base de datos
  await db.myCards.add(signedCard);

  return signedCard;
}