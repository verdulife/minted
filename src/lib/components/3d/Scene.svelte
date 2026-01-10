<script lang="ts">
	import type { Card } from '@/lib/db';
	import { Canvas, T } from '@threlte/core';
	import { Environment } from '@threlte/extras';
	import CardModel from '@/lib/components/3d/Card.svelte';

	interface Props {
		card: Card;
	}

	let { card }: Props = $props();

	let url = $derived(
		card.visualConfig.effect !== 'holographic' ? '/textures/squares-hd.jpg' : '/textures/holo.jpg'
	);

	// --- Lógica de Interacción ---
	let targetX = $state(0);
	let targetY = $state(0);

	let isPointerDown = $state(false);
	let currentBaseRotationY = $state(0); // 0 o Math.PI

	let lastTapTime = 0;

	function handlePointerDown(e: PointerEvent) {
		isPointerDown = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

		// Manual Double Tap/Click detection
		const now = Date.now();
		const TIMESPAN = 300; // ms
		if (now - lastTapTime < TIMESPAN) {
			handleFlip();
		}
		lastTapTime = now;
	}

	function handleFlip() {
		currentBaseRotationY = currentBaseRotationY === 0 ? Math.PI : 0;
		targetY = currentBaseRotationY;
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isPointerDown) return;

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		// Coordenadas normalizadas de -0.5 a 0.5
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		// Limitamos la inclinación (aprox ±30 grados = 0.5 rad)
		const limit = 0.5;
		targetX = y * limit * 2.5;
		targetY = currentBaseRotationY + x * limit * 2.5;
	}

	function handlePointerUp(e: PointerEvent) {
		isPointerDown = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		// Volver a la posición de reposo
		targetX = 0;
		targetY = currentBaseRotationY;
	}
</script>

<div
	class="size-full cursor-grab select-none active:cursor-grabbing"
	tabindex="0"
	role="button"
	aria-label="Visualizador de tarjeta 3D"
	style="touch-action: none"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
>
	<Canvas dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}>
		<T.PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

		<T.AmbientLight intensity={0.5} color="white" />
		<T.DirectionalLight position={[0.3, 1.3, 2.1]} intensity={0.5} color="white" />
		<Environment {url} isBackground={false} />

		<CardModel {card} {targetX} {targetY} isInteracting={isPointerDown} />
	</Canvas>
</div>
