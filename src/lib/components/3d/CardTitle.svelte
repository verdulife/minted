<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';

	interface Props {
		text: string;
		color?: string;
	}

	let { text }: Props = $props();

	const fontSize = 0.26;
	const maxWidth = 2;
	const lineHeight = 1.2;
	const color = 'black';
</script>

<Text position={[-1, 1.6, 0.03]} font="/fonts/Eina01-Bold.ttf" {text} {lineHeight} {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={1} roughness={0} />
</Text>
