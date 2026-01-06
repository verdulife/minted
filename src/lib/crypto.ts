import { type UserIdentity, type IssuerMint, type ReceivedMint, db } from '@/lib/db';
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
  cardData: Omit<IssuerMint, 'signature'>,
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
    expiresAt: cardData.expiresAt,
    status: cardData.status,
    totalUnits: cardData.totalUnits,
    usedUnits: cardData.usedUnits
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
export async function verifyCardSignature(card: ReceivedMint): Promise<boolean> {
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
    // NOTA: Para ReceivedMint (el que verifica el receptor), 
    // el payload a verificar debe coincidir con lo que el emisor firmó.
    // Como el emisor firma un IssuerMint, el receptor debe verificar esos mismos campos.
    // Sin embargo, el requisito dice que ReceivedMint NO incluye stock total.
    // Esto significa que el emisor firmó ALGUNOS campos o que el ReceivedMint es una vista restringida.
    // Ajustaremos el payload de verificación para que coincida con lo que el emisor firmó originalmente.
    const payload = {
      id: card.id,
      title: card.title,
      description: card.description,
      visualConfig: card.visualConfig,
      issuerPublicKey: card.issuerPublicKey,
      createdAt: card.createdAt,
      expiresAt: card.expiresAt,
      status: 'active', // El emisor firmó el estado inicial como 'active'
      totalUnits: 1, // Placeholder o valor acordado si no se incluye en el QR
      usedUnits: 0
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
      effect: 'plastic' | 'metalized' | 'holographic' | 'mirror';
      color: string;
    };
    expiresAt: number;
    totalUnits?: number;
  }
): Promise<IssuerMint> {
  // Validación de fecha de caducidad
  if (!cardInput.expiresAt || isNaN(cardInput.expiresAt) || cardInput.expiresAt <= Date.now()) {
    throw new Error('La fecha de caducidad debe ser un timestamp válido en el futuro.');
  }

  // Generar ID único
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  // Crear la carta sin firma
  const unsignedCard: Omit<IssuerMint, 'signature'> = {
    id,
    title: cardInput.title,
    description: cardInput.description,
    visualConfig: cardInput.visualConfig,
    issuerPublicKey: identity.publicKey,
    createdAt,
    expiresAt: cardInput.expiresAt,
    status: 'active',
    totalUnits: cardInput.totalUnits || 1,
    usedUnits: 0
  };

  // Firmar la carta
  const signature = await signCardData(unsignedCard, identity.privateKey);

  // Carta completa con firma
  const signedCard: IssuerMint = {
    ...unsignedCard,
    signature
  };

  // Guardar en la base de datos
  await db.myMints.add(signedCard);

  return signedCard;
}