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
	class="fixed inset-0 z-100 flex items-center justify-center bg-dark/50 p-6 backdrop-blur-md"
>
	<div
		transition:scale={{ duration: 300, start: 0.95 }}
		class="relative w-full max-w-sm rounded-3xl border border-light/10 bg-neutral-900 p-8 shadow-2xl"
	>
		<div class="flex flex-col items-center text-center">
			<h3 class="mb-2 text-3xl font-bold text-light">Compartir</h3>
			<p class="mb-8 text-neutral-400">
				Escanea este código para recibir tu <strong>Mint</strong>.
			</p>

			<!-- QR CONTAINER -->
			<div
				class="relative mb-8 aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl bg-white p-4 shadow-inner"
			>
				{#if qrDataURL}
					<img src={qrDataURL} alt="QR Code" class="h-full w-full" />
				{:else}
					<div class="flex h-full w-full items-center justify-center text-red-500">
						<p class="text-xs">Error al generar QR</p>
					</div>
				{/if}
			</div>

			<button
				onclick={onClose}
				class="w-full rounded-full border border-light/10 bg-light/5 py-4 text-sm font-semibold"
			>
				Cerrar
			</button>
		</div>
	</div>
</div>
