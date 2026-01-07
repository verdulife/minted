<script lang="ts">
	import type { Mint } from '$lib/db';
	import { onMount } from 'svelte';
	import { generateCardQR } from '$lib/qr';
	import { encodeMint } from '$lib/qrCodec';
	import Modal from './Modal.svelte';

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

<Modal closeModal={onClose}>
	<div class="flex flex-col items-center text-center">
		<h3 class="mb-2 text-3xl font-bold text-light">Compartir</h3>
		<p class="mb-8 text-neutral-400">
			Escanea este código para recibir tu <strong>Mint</strong>.
		</p>

		<!-- QR CONTAINER -->
		<div class="mb-8 w-full overflow-hidden rounded-2xl bg-white p-2 shadow-inner">
			{#if qrDataURL}
				<img src={qrDataURL} alt="QR Code" class="w-full" />
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
</Modal>
