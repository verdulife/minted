<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	const position = [-1, -1, 0.03];
	const color = '#111';
	const fontSize = 0.12;
	const maxWidth = 2;
	const lineHeight = 1.4;
</script>

<!-- Línea decorativa física (Inlay metálico) -->
<T.Mesh position={[0, -0.85, 0.03]}>
	<T.PlaneGeometry args={[maxWidth, 0.008]} />
	<T.MeshPhysicalMaterial
		{color}
		metalness={0.9}
		roughness={0.1}
		envMapIntensity={2}
		transparent={true}
		opacity={0.3}
	/>
</T.Mesh>

<Text {position} font="/fonts/Eina01-Regular.ttf" {text} {lineHeight} {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={0} roughness={0} envMapIntensity={1.5} />
</Text>
