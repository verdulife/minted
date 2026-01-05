<script lang="ts">
	import type { Card } from '@/lib/db';
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import * as THREE from 'three';
	import CardFrame from './CardFrame.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardLogo from './CardLogo.svelte';

	interface Props {
		card: Card;
		targetX?: number;
		targetY?: number;
		isInteracting?: boolean;
	}

	let { card, targetX = 0, targetY = 0, isInteracting = false }: Props = $props();

	const roughnessMap = useTexture('/textures/roughness.jpg', {
		transform: (t) => {
			t.wrapS = t.wrapT = THREE.RepeatWrapping;
			t.repeat.set(1, 1.4);
			return t;
		}
	});

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

<T.Group rotation={[rotationX, rotationY, 0]} position={[0, 0.75, 0]}>
	{#if card}
		<T.Mesh>
			<T.ExtrudeGeometry args={[shape, extrudeSettings]} />
			<T.MeshPhysicalMaterial
				color={card.visualConfig.color}
				roughness={0.6}
				metalness={0.8}
				clearcoat={1}
				clearcoatRoughness={0.05}
				roughnessMap={$roughnessMap}
			/>
		</T.Mesh>

		<CardFrame
			{width}
			{height}
			{radius}
			{depth}
			color={card.visualConfig.color}
			metalness={1}
			roughness={0}
		/>

		<CardTitle text={card.title} />

		<CardDescription text={card.description} />

		<CardLogo color={card.visualConfig.color} />
	{/if}
</T.Group>
