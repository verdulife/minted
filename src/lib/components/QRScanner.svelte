<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { processScannedCard } from '@/lib/qr';
	import type { Card } from '@/lib/db';

	interface Props {
		onCardScanned?: (card: Card) => void;
		onError?: (error: string) => void;
		onClose?: () => void;
	}

	let { onCardScanned, onError, onClose }: Props = $props();

	let scanner: Html5Qrcode | null = $state(null);
	let isScanning = $state(false);
	let scanResult = $state<{ success: boolean; card?: Card; error?: string } | null>(null);

	onMount(async () => {
		try {
			scanner = new Html5Qrcode('qr-reader');
			await startScanning();
		} catch (error) {
			console.error('Error inicializando escáner:', error);
			if (onError) {
				onError('No se pudo acceder a la cámara');
			}
		}
	});

	onDestroy(async () => {
		if (scanner && isScanning) {
			await scanner.stop();
		}
	});

	async function startScanning() {
		if (!scanner) return;

		try {
			await scanner.start(
				{ facingMode: 'environment' }, // Cámara trasera en móviles
				{
					fps: 10,
					qrbox: { width: 250, height: 250 }
				},
				async (decodedText) => {
					// QR escaneado exitosamente
					console.log('QR escaneado:', decodedText);

					// Detener el escáner
					if (scanner) {
						await scanner.stop();
						isScanning = false;
					}

					// Procesar la carta
					const result = await processScannedCard(decodedText);
					scanResult = result;

					if (result.success && result.card) {
						if (onCardScanned) {
							onCardScanned(result.card);
						}
					} else if (result.error) {
						if (onError) {
							onError(result.error);
						}
					}
				},
				(errorMessage) => {
					// Error de escaneo (normal cuando no hay QR en vista)
					// No logueamos esto para evitar spam en consola
				}
			);
			isScanning = true;
		} catch (error) {
			console.error('Error iniciando escáner:', error);
			if (onError) {
				onError('Error al iniciar la cámara');
			}
		}
	}

	async function handleClose() {
		if (scanner && isScanning) {
			await scanner.stop();
		}
		if (onClose) {
			onClose();
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
	<div class="w-full max-w-lg rounded-lg border border-white/20 bg-gray-900 p-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl font-bold text-white">📷 Escanear Carta</h2>
			<button onclick={handleClose} class="text-gray-400 transition-colors hover:text-white">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		{#if !scanResult}
			<div class="space-y-4">
				<p class="text-sm text-gray-300">
					Apunta la cámara al código QR de la carta para escanearla
				</p>

				<!-- Contenedor del escáner -->
				<div id="qr-reader" class="overflow-hidden rounded-lg border-2 border-purple-500/50"></div>

				{#if isScanning}
					<div class="text-center">
						<p class="animate-pulse text-sm text-green-400">🔍 Buscando código QR...</p>
					</div>
				{/if}
			</div>
		{:else if scanResult.success && scanResult.card}
			<div class="space-y-4">
				<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
					<h3 class="mb-2 text-lg font-semibold text-green-400">✅ Carta Recibida</h3>
					<div class="space-y-1 text-sm text-gray-300">
						<p><span class="text-gray-400">Título:</span> {scanResult.card.title}</p>
						<p><span class="text-gray-400">Descripción:</span> {scanResult.card.description}</p>
						<p><span class="text-gray-400">Rareza:</span> {scanResult.card.visualConfig.rarity}</p>
						<p><span class="text-gray-400">Efecto:</span> {scanResult.card.visualConfig.effect}</p>
					</div>
				</div>

				<button
					onclick={handleClose}
					class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 font-semibold transition-all hover:from-purple-600 hover:to-blue-600"
				>
					Cerrar
				</button>
			</div>
		{:else if scanResult.error}
			<div class="space-y-4">
				<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
					<h3 class="mb-2 text-lg font-semibold text-red-400">❌ Error</h3>
					<p class="text-sm text-gray-300">{scanResult.error}</p>
				</div>

				<button
					onclick={handleClose}
					class="w-full rounded-lg bg-gray-700 px-4 py-2 font-semibold transition-all hover:bg-gray-600"
				>
					Cerrar
				</button>
			</div>
		{/if}
	</div>
</div>
