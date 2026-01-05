<script lang="ts">
	import { type Card, AppDatabase } from '@/lib/db';
	import { identity } from '@/lib/stores';

	import QRScanner from '@/lib/components/QRScanner.svelte';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import Logo from '@/lib/assets/Logo.svelte';

	let showScanner = $state(false);
	let scannedCard: Card | null = $state(null);
	let scanError: string | null = $state(null);

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

<div class="min-hsv p-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<header>
			<Logo class="h-6" />
		</header>

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
					<div class="mt-4 h-100 overflow-hidden rounded-xl border border-white/10 bg-black/20">
						<Scene card={scannedCard} />
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
	</div>
</div>

<!-- Modal de Escáner -->
{#if showScanner}
	<QRScanner onCardScanned={handleCardScanned} onError={handleScanError} onClose={closeScanner} />
{/if}
