<script lang="ts">
	import type { Card } from '@/lib/db';
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { createCardTexture } from '@/lib/utils/cardTexture';
	import { Text } from '@threlte/extras';
	import CardFrame from './CardFrame.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';

	let { card, targetX = 0, targetY = 0, isInteracting = false } = $props();

	// Estado interno para la rotación animada
	let rotationX = $state(0);
	let rotationY = $state(0);

	// Definir la forma del naipe redondeado
	const width = 2.5;
	const height = width * 1.4;
	const radius = 0.1;
	const depth = 0.025;

	const shape = new THREE.Shape();
	shape.moveTo(-width / 2 + radius, -height / 2);
	shape.lineTo(width / 2 - radius, -height / 2);
	shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
	shape.lineTo(width / 2, height / 2 - radius);
	shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
	shape.lineTo(-width / 2 + radius, height / 2);
	shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
	shape.lineTo(-width / 2, -height / 2 + radius);
	shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

	const extrudeSettings = { depth, bevelEnabled: false };

	// Generar textura
	let texture: THREE.CanvasTexture | null = $state(null);

	$effect(() => {
		if (card) {
			let active = true;
			createCardTexture(card).then((t) => {
				if (active) {
					if (texture) texture.dispose();
					texture = t;
				} else {
					t.dispose();
				}
			});
			return () => {
				active = false;
			};
		}
	});

	// Lógica de suavizado (Lerp)
	useTask(() => {
		const lerpFactor = 0.1;
		rotationX += (targetX - rotationX) * lerpFactor;
		rotationY += (targetY - rotationY) * lerpFactor;

		if (!isInteracting) {
			const time = Date.now() / 2000;
			rotationX += Math.sin(time) * 0.001;
			rotationY += Math.cos(time) * 0.001;
		}
	});
</script>

<T.Group rotation={[rotationX, rotationY, 0]} position={[0, 0.5, 0]}>
	{#if card}
		<T.Mesh>
			<T.ExtrudeGeometry args={[shape, extrudeSettings]} />
			<T.MeshPhysicalMaterial
				color="gold"
				roughness={0.25}
				metalness={1}
				clearcoat={1}
				clearcoatRoughness={0.05}
			/>
		</T.Mesh>

		<CardFrame {width} {height} {radius} {depth} color="gold" metalness={1} roughness={0} />

		<CardTitle text="CHARIZARD VMAX" position={[-1, 1, 0.01]} size={0.025} color="black" />
		<CardDescription></CardDescription>
	{/if}
</T.Group>
