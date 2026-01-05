<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Card3D from './Card3D.svelte';
	import type { Card } from '@/lib/db';

	interface Props {
		card: Card;
	}
	let { card }: Props = $props();

	// --- Lógica de Interacción ---
	let targetX = $state(0);
	let targetY = $state(0);

	let isPointerDown = $state(false);
	let lastPointerX = 0;
	let pointerVelocity = 0;
	let currentBaseRotationY = 0; // 0 o Math.PI

	function handlePointerDown(e: PointerEvent) {
		isPointerDown = true;
		lastPointerX = e.clientX;
		pointerVelocity = 0;
	}

	function handlePointerMove(e: PointerEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		if (!isPointerDown) {
			// Tilt suave (hover)
			targetY = currentBaseRotationY + x * 0.4;
			targetX = y * 0.4;
			return;
		}

		// Drag activo
		const deltaX = e.clientX - lastPointerX;
		pointerVelocity = deltaX;
		lastPointerX = e.clientX;
		targetY += deltaX * 0.01;
	}

	function handlePointerUp() {
		isPointerDown = false;

		// Flick detection
		if (Math.abs(pointerVelocity) > 12) {
			const direction = pointerVelocity > 0 ? 1 : -1;
			currentBaseRotationY += Math.PI * direction;
		}

		// Snap
		currentBaseRotationY = Math.round(currentBaseRotationY / Math.PI) * Math.PI;
		targetY = currentBaseRotationY;
		targetX = 0;
	}
</script>

<div
	class="relative h-full w-full cursor-grab select-none active:cursor-grabbing"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
>
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />

		<T.AmbientLight intensity={0.6} />
		<T.DirectionalLight position={[5, 10, 7]} intensity={2.0} />
		<T.PointLight position={[-5, 5, -5]} intensity={0.8} color="#4c1d95" />

		<Card3D {card} {targetX} {targetY} isInteracting={isPointerDown} />
	</Canvas>

	<div
		class="pointer-events-none absolute right-6 bottom-6 flex items-center gap-2 text-[10px] tracking-widest text-white/10 uppercase"
	>
		<span class="inline-block h-px w-4 bg-white/10"></span>
		Desliza rápido para voltear
	</div>
</div>
