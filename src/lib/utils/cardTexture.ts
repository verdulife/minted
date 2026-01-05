import type { Card } from '@/lib/db';
import { CanvasTexture } from 'three';

/**
 * Dibuja el contenido de la carta en un canvas.
 * Esta es la función base que comparten la vista 2D y 3D.
 */
async function drawCardToCanvas(canvas: HTMLCanvasElement, card: Card) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No se pudo obtener el contexto 2D');

  // Asegurar que la fuente esté cargada antes de dibujar
  try {
    await document.fonts.ready;
    await document.fonts.load('900 40px Poppins');
    await document.fonts.load('500 20px Poppins');
  } catch (e) {
    console.warn('Error cargando fuentes, usando fallback:', e);
  }

  // El radio debe ser proporcional al modelo 3D (0.15 / 3 = 0.05)
  const radius = width * 0.025;

  // 1. Limpiar con transparencia (Crucial para que los bordes del plano no se vean)
  ctx.clearRect(0, 0, width, height);

  // 2. Definir el path redondeado principal para el fondo 'naipe'
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  // 3. Fondo blanco de la carta
  ctx.fillStyle = '#111';
  ctx.fill();

  // Clipping para que nada se salga (opcional si usamos fillRect arriba, pero bueno para sombras)
  ctx.save();
  ctx.clip();

  // 5. Layout Tipográfico
  const paddingX = 40;

  // TITULO protagonista
  ctx.fillStyle = '#fff';
  ctx.font = '700 60px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const titleY = 60;
  const wordsTitle = card.title.split(' ');
  let titleLine = '';
  let currentTitleY = titleY;
  const maxTitleWidth = width - (paddingX * 2);

  for (let n = 0; n < wordsTitle.length; n++) {
    const testLine = titleLine + wordsTitle[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTitleWidth && n > 0) {
      ctx.fillText(titleLine, paddingX, currentTitleY);
      titleLine = wordsTitle[n] + ' ';
      currentTitleY += 78;
    } else {
      titleLine = testLine;
    }
  }
  ctx.fillText(titleLine, paddingX, currentTitleY);

  // DESCRIPCIÓN
  ctx.fillStyle = '#999';
  ctx.font = '500 18px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';

  const wordsDesc = (card.description || '').split(' ');
  let descLine = '';
  const descLines: string[] = [];
  const maxDescWidth = width - 150;

  for (let n = 0; n < wordsDesc.length; n++) {
    const testLine = descLine + wordsDesc[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxDescWidth && n > 0) {
      descLines.push(descLine);
      descLine = wordsDesc[n] + ' ';
    } else {
      descLine = testLine;
    }
  }
  descLines.push(descLine);

  let currentDescY = height - 50;
  const descLineHeight = 28;
  for (let i = descLines.length - 1; i >= 0; i--) {
    ctx.fillText(descLines[i], paddingX, currentDescY);
    currentDescY -= descLineHeight;
  }

  ctx.restore();
}

/**
 * Crea una textures de Three.js para usar en modelos 3D.
 */
export async function createCardTexture(card: Card): Promise<CanvasTexture> {
  const width = 512;
  const height = 717; // Coincide con el ratio 3/4.2 (1.4)

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  await drawCardToCanvas(canvas, card);

  return new CanvasTexture(canvas);
}

/**
 * Crea una imagen 2D (Data URL) para previsualizaciones rápidas en grids.
 */
export async function createCardImage(card: Card): Promise<string> {
  const width = 256; // Resolución menor para el grid
  const height = 358; // Ratio 1.4 consistent con 3D

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  await drawCardToCanvas(canvas, card);

  return canvas.toDataURL('image/png');
}




