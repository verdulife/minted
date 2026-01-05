<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';

	interface Props {
		text: string;
		color?: string;
	}

	let { text }: Props = $props();

	const position = [-1, 1.4, 0.03];
	const fontSize = 0.26;
	const maxWidth = 2;
	const lineHeight = 1.2;
	const color = '#111';
</script>

<Text {position} font="/fonts/Eina01-Bold.ttf" {text} {lineHeight} {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={0} roughness={0} envMapIntensity={1.5} />
</Text>
