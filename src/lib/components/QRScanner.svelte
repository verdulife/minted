<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import Back from './Back.svelte';

	interface Props {
		onScan: (text: string) => void;
		onError?: (error: string) => void;
	}

	let { onScan, onError }: Props = $props();

	let scanner: Html5Qrcode | null = $state(null);
	let isScanning = $state(false);

	onMount(async () => {
		try {
			scanner = new Html5Qrcode('qr-reader');
			await startScanning();
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

<div>
	<Back />

	<!-- SCANNER CONTAINER (FULLSCREEN) -->
	<div id="qr-reader" class="h-svh w-full overflow-hidden"></div>

	<!-- OVERLAY UI -->
	<div class="pointer-events-none absolute inset-0 z-10 flex flex-col">
		<!-- CENTER MASK (Visual decoration) -->
		<div class="relative flex flex-1 items-center justify-center"></div>

		<!-- FOOTER -->
		<div class="bg-linear-to-t from-black/80 to-transparent p-12 text-center">
			<p class="text-sm text-neutral-400">Centra el código QR en el cuadro</p>
		</div>
	</div>
</div>

<style>
	/* Estilos para el video que genera html5-qrcode */
	:global(#qr-reader video) {
		object-fit: cover !important;
		height: 100% !important;
		width: 100% !important;
	}
</style>
