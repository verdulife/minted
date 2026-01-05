import { type Card, db } from '@/lib/db';
import { verifyCardSignature } from '@/lib/crypto';
import QRCode from 'qrcode';

/**
 * Genera un código QR en formato Data URL a partir de una carta firmada
 */
export async function generateCardQR(card: Card): Promise<string> {
  // Serializar la carta completa como JSON
  const cardJSON = JSON.stringify(card);

  // Generar QR como Data URL (imagen base64)
  const qrDataURL = await QRCode.toDataURL(cardJSON, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  return qrDataURL;
}

/**
 * Procesa una carta escaneada desde un QR
 * Verifica la firma y la guarda en receivedCards si es válida
 */
export async function processScannedCard(cardJSON: string): Promise<{
  success: boolean;
  card?: Card;
  error?: string;
}> {
  try {
    // Parsear el JSON
    const card: Card = JSON.parse(cardJSON);

    // Validar estructura básica
    if (!card.id || !card.signature || !card.issuerPublicKey) {
      return {
        success: false,
        error: 'Estructura de carta inválida'
      };
    }

    // Verificar la firma digital
    const isValid = await verifyCardSignature(card);

    if (!isValid) {
      return {
        success: false,
        error: 'Firma digital inválida. La carta puede haber sido alterada.'
      };
    }

    // Verificar si ya existe en receivedCards
    const existing = await db.receivedCards.get(card.id);
    if (existing) {
      return {
        success: false,
        error: 'Esta carta ya está en tu colección'
      };
    }

    // Guardar en receivedCards
    await db.receivedCards.add(card);

    return {
      success: true,
      card
    };
  } catch (error) {
    console.error('Error procesando carta escaneada:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Descarga el QR como imagen PNG
 */
export function downloadQRImage(dataURL: string, filename: string = 'carta-qr.png') {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  link.click();
}
