<script lang="ts">
	import type { Card } from '@/lib/db';
	import { T, useTask } from '@threlte/core';
	import { RepeatWrapping, Shape } from 'three';
	/* import { useTexture } from '@threlte/extras'; */
	/* import CardFrame from '@/lib/components/3d/CardFrame.svelte'; */
	import CardTitle from '@/lib/components/3d/CardTitle.svelte';
	import CardDescription from '@/lib/components/3d/CardDescription.svelte';
	import CardLogo from '@/lib/components/3d/CardLogo.svelte';

	interface Props {
		card: Card;
		targetX?: number;
		targetY?: number;
		isInteracting?: boolean;
	}

	let { card, targetX = 0, targetY = 0, isInteracting = false }: Props = $props();
	let textColor = $derived(card.visualConfig.color === 'black' ? 'white' : 'black');

	/* const roughnessMap = useTexture('/textures/roughness.jpg', {
		transform: (t) => {
			t.wrapS = t.wrapT = RepeatWrapping;
			t.repeat.set(1, 1.4);
			return t;
		}
	}); */

	let rotationX = $state(0);
	let rotationY = $state(0);

	// Definir la forma del naipe redondeado
	const width = 2.5;
	const height = width * 1.5;
	const radius = 0.1;
	const depth = 0.025;

	const shape = new Shape();
	shape.moveTo(-width / 2 + radius, -height / 2);
	shape.lineTo(width / 2 - radius, -height / 2);
	shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
	shape.lineTo(width / 2, height / 2 - radius);
	shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
	shape.lineTo(-width / 2 + radius, height / 2);
	shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
	shape.lineTo(-width / 2, -height / 2 + radius);
	shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

	const extrudeSettings = {
		depth,
		bevelEnabled: true,
		bevelThickness: 0.004,
		bevelSize: 0.01,
		bevelSegments: 10
	};

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

<!-- TODO: mejorar margenes y tamaños para el footer tenga espacio para la descripcion y añadir la fecha de caducidad -->

<T.Group rotation={[rotationX, rotationY, 0]} position={[0, 0.25, 0]}>
	{#if card}
		<T.Mesh>
			<T.ExtrudeGeometry args={[shape, extrudeSettings]} />
			<T.MeshPhysicalMaterial
				color={card.visualConfig.color}
				metalness={0.5}
				roughness={0.3}
				clearcoat={1}
				clearcoatRoughness={0.15}
				iridescence={1}
				iridescenceIOR={1}
				iridescenceThicknessRange={[0, 2400]}
				thickness={1}
				attenuationDistance={0.5}
			/>
		</T.Mesh>

		<!-- <CardFrame
			{width}
			{height}
			{radius}
			{depth}
			color={card.visualConfig.color}
			metalness={1}
			roughness={0}
		/> -->

		<CardTitle text={card.title} color={textColor} />
		<CardDescription text={card.description} color={textColor} />
		<CardLogo color={textColor} />
	{/if}
</T.Group>
