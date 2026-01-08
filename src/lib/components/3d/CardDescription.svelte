<script lang="ts">
	import { formatExpirationDate } from '@/lib/utils';
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';

	interface Props {
		text: string;
		expiration: number;
		color?: string;
	}

	let { text, expiration, color }: Props = $props();

	const fontSize = 0.11;
	const maxWidth = 2.2;
	const lineHeight = 1.4;

	let expirationText = $derived(formatExpirationDate(expiration));
</script>

<Text
	position={[-1.1, -1, 0.03]}
	font="/fonts/Graduate-Regular.ttf"
	text={expirationText}
	{lineHeight}
	{maxWidth}
	fontSize={0.15}
	outlineColor="black"
	outlineWidth={0.002}
	outlineOffsetY={0.002}
	outlineBlur={0.005}
>
	<T.MeshPhysicalMaterial {color} metalness={0.7} roughness={0} />
</Text>

<!-- Línea decorativa física (Inlay metálico) -->
<T.Mesh position={[0, -1.3, 0.03]}>
	<T.PlaneGeometry args={[maxWidth, 0.008]} />
	<T.MeshPhysicalMaterial
		{color}
		metalness={0.5}
		roughness={0.3}
		clearcoat={1}
		clearcoatRoughness={0.15}
		iridescence={1}
		iridescenceIOR={1}
		iridescenceThicknessRange={[0, 2400]}
		transmission={0.5}
		thickness={1}
		attenuationDistance={0.5}
	/>
</T.Mesh>

<Text
	position={[-1.1, -1.4, 0.03]}
	font="/fonts/Eina01-Regular.ttf"
	{text}
	{lineHeight}
	{maxWidth}
	{fontSize}
>
	<T.MeshPhysicalMaterial {color} metalness={0} roughness={0} />
</Text>
