<script lang="ts">
	import { type Card, AppDatabase } from '@/lib/db';

	import { identity } from '@/lib/stores';
	import { onMount } from 'svelte';
	import { createAndMintCard, verifyCardSignature } from '@/lib/crypto';
	import { generateCardQR, downloadQRImage } from '@/lib/qr';

	import QRScanner from '@/lib/components/QRScanner.svelte';
	import Scene3D from '@/lib/components/3d/Scene3D.svelte';

	let testCard: Card | null = $state(null);
	let verificationResult: boolean | null = $state(null);
	let qrDataURL: string | null = $state(null);
	let showScanner = $state(false);
	let scannedCard: Card | null = $state(null);
	let scanError: string | null = $state(null);

	async function generateQR() {
		if (!testCard) return;

		isGeneratingQR = true;
		try {
			const qr = await generateCardQR(testCard);
			qrDataURL = qr;
			console.log('✅ QR generado');
		} catch (error) {
			console.error('❌ Error generando QR:', error);
		} finally {
			isGeneratingQR = false;
		}
	}

	function downloadQR() {
		if (!qrDataURL) return;
		downloadQRImage(qrDataURL, `carta-${testCard?.id}.png`);
	}

	function openScanner() {
		showScanner = true;
		scannedCard = null;
		scanError = null;
	}

	function handleCardScanned(card: Card) {
		scannedCard = card;
		console.log('✅ Carta escaneada y guardada:', card);
	}

	function handleScanError(error: string) {
		scanError = error;
		console.error('❌ Error escaneando:', error);
	}

	function closeScanner() {
		showScanner = false;
	}
</script>

<div class="min-h-screen bg-linear-to-br from-purple-900 via-black to-blue-900 p-8 text-white">
	<div class="mx-auto max-w-4xl space-y-6">
		<h1
			class="mb-8 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent"
		>
			MINTED
		</h1>

		<!-- Panel de Identidad -->
		{#if $identity}
			<!-- Panel de Prueba de Criptografía -->
			<div class="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
				<h2 class="mb-4 text-2xl font-semibold text-blue-400">Prueba de Firma Digital</h2>

				<div class="flex flex-wrap gap-4">
					<a
						href="/create"
						class="inline-block rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/20"
					>
						Crear Nueva Carta
					</a>

					<a
						href="/collection"
						class="inline-block rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
					>
						Ver Mi Colección
					</a>
				</div>
			</div>

			<!-- Panel de Escáner -->
			<div class="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
				<h2 class="mb-4 text-2xl font-semibold text-cyan-400">Recibir Cartas</h2>

				<button
					onclick={openScanner}
					class="rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold transition-all hover:from-cyan-600 hover:to-blue-600"
				>
					Escanear Código QR
				</button>

				{#if scannedCard}
					<div class="mt-4 h-[400px] overflow-hidden rounded-xl border border-white/10 bg-black/20">
						<Scene3D card={scannedCard} />
					</div>

					<div class="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
						<h3 class="mb-2 text-lg font-semibold text-green-400">Carta Recibida</h3>
						<div class="space-y-1 text-sm text-gray-300">
							<p><span class="text-gray-400">Título:</span> {scannedCard.title}</p>
							<p><span class="text-gray-400">Descripción:</span> {scannedCard.description}</p>
							<p><span class="text-gray-400">Rareza:</span> {scannedCard.visualConfig.rarity}</p>
							<p><span class="text-gray-400">Efecto:</span> {scannedCard.visualConfig.effect}</p>
						</div>
						<p class="mt-2 text-xs text-gray-400">
							Verifica en IndexedDB → MintedDB → receivedCards
						</p>
					</div>
				{/if}

				{#if scanError}
					<div class="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
						<h3 class="mb-2 text-lg font-semibold text-red-400">Error</h3>
						<p class="text-sm text-gray-300">{scanError}</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-6 backdrop-blur-md">
				<p class="text-yellow-400">Generando identidad...</p>
			</div>
		{/if}

		<div class="mt-12 flex justify-center">
			<button
				onclick={AppDatabase.resetDatabase}
				class="rounded px-4 py-2 text-xs text-red-400 underline transition-colors hover:bg-red-500/10 hover:text-red-300"
			>
				⚠️ Reset App & Database
			</button>
		</div>
	</div>
</div>

<!-- Modal de Escáner -->
{#if showScanner}
	<QRScanner onCardScanned={handleCardScanned} onError={handleScanError} onClose={closeScanner} />
{/if}
