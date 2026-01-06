<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	const color = 'black';
	const fontSize = 0.12;
	const maxWidth = 2;
	const lineHeight = 1.4;
</script>

<!-- Línea decorativa física (Inlay metálico) -->
<T.Mesh position={[0, -1, 0.03]}>
	<T.PlaneGeometry args={[maxWidth, 0.008]} />
	<T.MeshPhysicalMaterial
		{color}
		metalness={1}
		roughness={1}
	/>
</T.Mesh>

<Text position={[-1, -1.2, 0.03]} font="/fonts/Eina01-Regular.ttf" {text} {lineHeight} {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={1} />
</Text>
