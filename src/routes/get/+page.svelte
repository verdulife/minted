<script lang="ts">
	import { db, type Mint, type ReceivedMint, type IssuerMint } from '@/lib/db';
	import { goto } from '$app/navigation';
	import QRScanner from '@/lib/components/QRScanner.svelte';
	import { decodeMint, isCompressedMint } from '@/lib/qrCodec';
	import { processScannedCard } from '@/lib/qr';
	import { isExpired } from '@/lib/logic';
	import { fade, scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const { url } = $page;
	const base64Data = url.searchParams.get('m');
	const mint = base64Data ? atob(base64Data) : null;

	// Estado
	type ScanResult =
		| { type: 'received'; mint: ReceivedMint }
		| { type: 'validated'; mint: IssuerMint }
		| { type: 'error'; message: string };

	let result = $state<ScanResult | null>(null);
	let isProcessing = $state(false);

	async function handleScan(text: string) {
		isProcessing = true;
		try {
			// 1. Decodificar datos
			let decoded: Mint;
			if (isCompressedMint(text)) {
				decoded = decodeMint(text) as any;
			} else {
				decoded = JSON.parse(text);
			}

			// 2. ¿Soy el emisor?
			const myMint = await db.myMints.get(decoded.id);

			if (myMint) {
				// FLUJO A: VALIDACIÓN (SOY EL EMISOR)
				if (isExpired(myMint.expiresAt)) {
					result = { type: 'error', message: 'Este Mint ha caducado.' };
				} else if (myMint.usedUnits >= myMint.totalUnits) {
					result = { type: 'error', message: 'Este Mint ya ha alcanzado su límite de usos.' };
				} else {
					// Actualizar unidades
					const newUsed = myMint.usedUnits + 1;
					const newStatus = newUsed >= myMint.totalUnits ? 'redeemed' : 'active';

					await db.myMints.update(myMint.id, {
						usedUnits: newUsed,
						status: newStatus
					});

					result = {
						type: 'validated',
						mint: { ...myMint, usedUnits: newUsed, status: newStatus }
					};
				}
			} else {
				// FLUJO B: RECIBIR (SOY EL CLIENTE)
				const processResult = await processScannedCard(text);

				if (processResult.success && processResult.card) {
					result = { type: 'received', mint: processResult.card };
				} else {
					result = { type: 'error', message: processResult.error || 'Error al procesar el Mint.' };
				}
			}
		} catch (e) {
			console.error('Scan error:', e);
			result = { type: 'error', message: 'Código QR no reconocido o dañado.' };
		} finally {
			isProcessing = false;
		}
	}

	function closeResult() {
		result = null;
	}

	onMount(() => {
		if (mint) {
			handleScan(mint);
		}
	});
</script>

<div class="h-svh w-full bg-black">
	<!-- ESCÁNER SIEMPRE ACTIVO SI NO HAY RESULTADO -->
	{#if !result}
		<QRScanner onScan={handleScan} onError={(err) => (result = { type: 'error', message: err })} />
	{/if}

	<!-- MODALES DE RESULTADO -->
	{#if result}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-150 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
		>
			<div
				transition:scale={{ duration: 300, start: 0.9 }}
				class="w-full max-w-sm rounded-3xl border border-light/10 bg-neutral-900 p-8 text-center shadow-2xl"
			>
				{#if result.type === 'validated'}
					<!-- ICONO ÉXITO VALIDACIÓN -->
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">¡Canje Válido!</h2>
					<p class="mb-6 text-sm text-neutral-400">
						Has validado una unidad de <strong>{result.mint.title}</strong>.<br />
						Usos: {result.mint.usedUnits} / {result.mint.totalUnits}
					</p>
				{:else if result.type === 'received'}
					<!-- ICONO ÉXITO RECEPCIÓN -->
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">¡Nuevo Mint!</h2>
					<p class="mb-6 text-sm text-neutral-400">
						Se ha añadido <strong>{result.mint.title}</strong> a tu colección correctamente.
					</p>
					<button
						onclick={() => goto('/')}
						class="mb-3 w-full rounded-2xl bg-white py-4 text-sm font-bold text-black transition-all active:scale-95"
					>
						Ver mi colección
					</button>
				{:else}
					<!-- ICONO ERROR -->
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-400"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">Sin éxito</h2>
					<p class="mb-8 text-sm text-neutral-400">{result.message}</p>
				{/if}

				<button
					onclick={closeResult}
					class="w-full rounded-2xl bg-white/5 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
				>
					Cerrar
				</button>
			</div>
		</div>
	{/if}
</div>
