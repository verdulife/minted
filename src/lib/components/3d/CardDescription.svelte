<script lang="ts">
	import { T } from '@threlte/core';
	import { Align, Text } from '@threlte/extras';
	import { MeshBasicMaterial } from 'three';

	let text = 'Carta de ejemplo mas lasrgo quete asdkjasdh yunas dieas de comoim cmaoisdj ',
		position = [-1, -1, 0.03],
		fontSize = 0.12,
		maxWidth = 2,
		lineHeight = 1.4,
		color = '#111';
</script>

<Text {position} font="/fonts/GoogleSans-Regular.ttf" {text} {lineHeight} {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={0} roughness={0} envMapIntensity={1.5} />
</Text>
