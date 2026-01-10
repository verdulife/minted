import { type Mint, type ReceivedMint, db } from '@/lib/db';
import { verifyCardSignature } from '@/lib/crypto';
import { decodeMint, isCompressedMint } from '@/lib/qrCodec';
import QRCode from 'qrcode';

/**
 * Genera un código QR en formato Data URL a partir de una carta firmada
 */
export async function generateCardQR(card: Mint, customData?: string): Promise<string> {
  // Serializar la carta completa como JSON o usar data personalizada (comprimida)
  const data = customData || JSON.stringify(card);
  const base64Data = btoa(data);
  console.log(base64Data);

  console.log(base64Data);
  const url = `https://minted-orcin.vercel.app/get?m=${base64Data}`;

  // Generar QR como Data URL (imagen base64)
  const qrDataURL = await QRCode.toDataURL(url, {
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

export async function processScannedCard(rawJSON: string): Promise<{
  success: boolean;
  card?: ReceivedMint;
  error?: string;
}> {
  try {
    let card: ReceivedMint;

    // Detectar si los datos están comprimidos y decodificar si es necesario
    if (isCompressedMint(rawJSON)) {
      card = decodeMint(rawJSON);
    } else {
      card = JSON.parse(rawJSON);
    }

    // Validar estructura básica (usando las claves largas ya decodificadas)
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

    // Verificar si ya existe en collection
    const existing = await db.collection.get(card.id);
    if (existing) {
      return {
        success: false,
        error: 'Esta carta ya está en tu colección'
      };
    }

    // Guardar en collection
    await db.collection.add(card);

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
