<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { Vector3, BufferGeometry } from 'three';

	let text = 'Vale por una cena romántica en pareja.',
		position = [-1, 1.4, 0.03],
		fontSize = 0.26,
		maxWidth = 2,
		lineHeight = 1.2,
		color = '#111';

	// Definimos los puntos de inicio y fin
	const points = [new Vector3(-1.2, 0, 0), new Vector3(0.8, 0, 0)];
	const geometry = new BufferGeometry().setFromPoints(points);
</script>

<T.Line position={[0.2, -0.9, 0.03]} {geometry}>
	<T.LineBasicMaterial {color} opacity={0.1} />
</T.Line>

<Text {position} font="/fonts/GoogleSans-Bold.ttf" {text} {lineHeight} f {maxWidth} {fontSize}>
	<T.MeshPhysicalMaterial {color} metalness={0} roughness={0} envMapIntensity={1.5} />
</Text>
