<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { fade } from 'svelte/transition';

	interface Props {
		onScan: (text: string) => void;
		onError?: (error: string) => void;
		onClose: () => void;
	}

	let { onScan, onError, onClose }: Props = $props();

	let scanner: Html5Qrcode | null = $state(null);
	let isScanning = $state(false);

	onMount(async () => {
		try {
			// Pequeño delay para asegurar que el DOM esté listo y las transiciones no interfieran
			setTimeout(async () => {
				scanner = new Html5Qrcode('qr-reader');
				await startScanning();
			}, 300);
		} catch (error) {
			console.error('Error inicializando escáner:', error);
			if (onError) onError('No se pudo acceder a la cámara');
		}
	});

	onDestroy(async () => {
		if (scanner && isScanning) {
			try {
				await scanner.stop();
			} catch (e) {
				// Ignorar errores al cerrar
			}
		}
	});

	async function startScanning() {
		if (!scanner) return;

		try {
			await scanner.start(
				{ facingMode: 'environment' },
				{
					fps: 15,
					qrbox: (viewWidth, viewHeight) => {
						const size = Math.min(viewWidth, viewHeight) * 0.7;
						return { width: size, height: size };
					}
				},
				async (decodedText) => {
					if (scanner && isScanning) {
						await scanner.stop();
						isScanning = false;
					}
					onScan(decodedText);
				},
				() => {} // Ignorar errores de lectura continua
			);
			isScanning = true;
		} catch (error) {
			console.error('Error iniciando escáner:', error);
			if (error instanceof Error && error.message.includes('camera')) {
				if (onError) onError('Permiso de cámara denegado');
			}
		}
	}
</script>

<div
	transition:fade={{ duration: 300 }}
	class="bg-opacity-95 fixed inset-0 z-100 flex flex-col bg-black"
>
	<!-- SCANNER CONTAINER (FULLSCREEN) -->
	<div id="qr-reader" class="h-svh w-full overflow-hidden"></div>

	<!-- OVERLAY UI -->
	<div class="pointer-events-none absolute inset-0 z-10 flex flex-col">
		<!-- HEADER -->
		<div
			class="pointer-events-auto flex items-center justify-between bg-linear-to-b from-black/80 to-transparent p-6 pt-12"
		>
			<div class="flex flex-col">
				<h2 class="text-xl font-bold text-white">Escaneando...</h2>
				<p class="text-xs text-neutral-400">Centra el código QR en el cuadro</p>
			</div>

			<button
				onclick={onClose}
				class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
			>
				<span class="text-2xl">✕</span>
			</button>
		</div>

		<!-- CENTER MASK (Visual decoration) -->
		<div class="relative flex flex-1 items-center justify-center">
			<div
				class="relative h-64 w-64 rounded-3xl border-2 border-white/20 shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]"
			>
				<!-- CORNERS -->
				<div
					class="absolute -top-1 -left-1 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4 border-white"
				></div>
				<div
					class="absolute -top-1 -right-1 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4 border-white"
				></div>
				<div
					class="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-white"
				></div>
				<div
					class="absolute -right-1 -bottom-1 h-8 w-8 rounded-br-2xl border-r-4 border-b-4 border-white"
				></div>

				<!-- SCANNING LINE ANIMATION -->
				{#if isScanning}
					<div
						class="absolute inset-x-4 top-0 h-1 animate-[scan_2s_infinite] bg-linear-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"
					></div>
				{/if}
			</div>
		</div>

		<!-- FOOTER -->
		<div class="bg-linear-to-t from-black/80 to-transparent p-12 text-center">
			<p class="text-xs text-neutral-400">Compatible con tarjetas físicas y digitales</p>
		</div>
	</div>
</div>

<style>
	@keyframes scan {
		0%,
		100% {
			top: 10%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			top: 90%;
			opacity: 0;
		}
	}

	/* Estilos para el video que genera html5-qrcode */
	:global(#qr-reader video) {
		object-fit: cover !important;
		height: 100% !important;
		width: 100% !important;
	}
</style>
