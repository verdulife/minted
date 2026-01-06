<script lang="ts">
	import { onMount } from 'svelte';
	import { generateCardQR } from '$lib/qr';
	import { encodeMint } from '$lib/qrCodec';
	import type { Mint } from '$lib/db';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		mint: Mint;
		onClose: () => void;
	}

	let { mint, onClose }: Props = $props();

	let qrDataURL = $state<string>('');
	let loading = $state(true);

	onMount(async () => {
		try {
			// Usamos el codec para comprimir los datos antes de generar el QR
			const encodedData = encodeMint(mint);
			qrDataURL = await generateCardQR(mint, encodedData);
		} catch (e) {
			console.error('Error generating QR:', e);
		} finally {
			loading = false;
		}
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 z-100 flex items-center justify-center bg-dark/95 p-6 backdrop-blur-md"
>
	<div
		transition:scale={{ duration: 300, start: 0.95 }}
		class="relative w-full max-w-sm rounded-3xl border border-light/10 bg-neutral-900 p-8 shadow-2xl"
	>
		<!-- CLOSE BUTTON -->
		<button
			onclick={onClose}
			class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10"
		>
			<span class="text-xl">✕</span>
		</button>

		<div class="flex flex-col items-center text-center">
			<div
				class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="5" height="5" x="3" y="3" rx="1" />
					<rect width="5" height="5" x="16" y="3" rx="1" />
					<rect width="5" height="5" x="3" y="16" rx="1" />
					<path d="M21 16h-3a2 2 0 0 0-2 2v3" />
					<path d="M21 21v.01" />
					<path d="M12 7v3a2 2 0 0 1-2 2H7" />
					<path d="M3 12h.01" />
					<path d="M12 3h.01" />
					<path d="M12 16v.01" />
					<path d="M16 12h1" />
					<path d="M21 12v.01" />
					<path d="M12 21v-1" />
				</svg>
			</div>

			<h3 class="mb-2 text-xl font-bold text-light">Compartir {mint.title}</h3>
			<p class="mb-8 text-sm text-neutral-400">
				Escanea este código para recibir una copia de esta carta.
			</p>

			<!-- QR CONTAINER -->
			<div
				class="relative mb-8 aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl bg-white p-4 shadow-inner"
			>
				{#if loading}
					<div class="flex h-full w-full items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
						></div>
					</div>
				{:else if qrDataURL}
					<img src={qrDataURL} alt="QR Code" class="h-full w-full" />
				{:else}
					<div class="flex h-full w-full items-center justify-center text-red-500">
						<p class="text-xs">Error al generar QR</p>
					</div>
				{/if}
			</div>

			<button
				onclick={onClose}
				class="w-full rounded-2xl bg-light py-4 text-sm font-bold text-dark transition-all active:scale-95"
			>
				Cerrar
			</button>
		</div>
	</div>
</div>
