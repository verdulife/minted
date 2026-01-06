<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';

	interface Props {
		color: string;
	}

	let { color }: Props = $props();

	const logoTexture = useTexture('/vertical-logotype.png');
	const width = 1;

	// Calculamos el ratio de aspecto automáticamente para evitar deformaciones
	let aspectRatio = $derived(
		$logoTexture?.image ? $logoTexture.image.width / $logoTexture.image.height : 1
	);
	let height = $derived(width / aspectRatio);
</script>

<T.Mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]}>
	<T.PlaneGeometry args={[width, height]} />
	{#if $logoTexture}
		<T.MeshPhysicalMaterial
			{color}
			map={$logoTexture}
			transparent={true}
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
	{/if}
</T.Mesh>
