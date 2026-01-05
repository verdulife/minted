<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';

	interface Props {
		color: string;
	}

	let { color }: Props = $props();

	const logoTexture = useTexture('/vertical-logotype.png');
	const position = [0, 0, -0.001];
	const width = 1;

	// Calculamos el ratio de aspecto automáticamente para evitar deformaciones
	let aspectRatio = $derived(
		$logoTexture?.image ? $logoTexture.image.width / $logoTexture.image.height : 1
	);
	let height = $derived(width / aspectRatio);
</script>

<T.Mesh {position} rotation={[0, Math.PI, 0]}>
	<T.PlaneGeometry args={[width, height]} />
	{#if $logoTexture}
		<T.MeshPhysicalMaterial
			map={$logoTexture}
			transparent={true}
			alphaTest={0.05}
			metalness={1}
			roughness={0}
			envMapIntensity={1}
			{color}
		/>
	{/if}
</T.Mesh>
