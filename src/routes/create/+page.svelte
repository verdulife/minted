<script lang="ts">
	import { type IssuerMint, type Mint } from '@/lib/db';
	import { goto } from '$app/navigation';
	import { identity } from '@/lib/stores';
	import { createAndMintCard } from '@/lib/crypto';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import CreateIcon from '@/lib/assets/CreateIcon.svelte';
	import Back from '@/lib/components/Back.svelte';
	import EditorContent from '@/lib/components/ui/EditorContent.svelte';
	import EditorStyles from '@/lib/components/ui/EditorStyles.svelte';
	import CollectionIcon from '@/lib/assets/CollectionIcon.svelte';

	// --- Estado ---
	let contentEditor = $state(false);
	let stylesEditor = $state(false);

	// Inputs del usuario
	let title = $state('Ejemplo de valor de carta');
	let description = $state('Ejemplo de anotaciones con un texto ligeramente largo.');
	let color = $state('crimson');
	let effect: 'plastic' | 'metalized' | 'holographic' | 'mirror' = $state('plastic');
	let totalUnits = $state(1);

	let isMinting = $state(false);

	// Expiración
	let year = new Date().getFullYear();
	let month = new Date().getMonth() + 1;
	let expiresAt = $state(year + '-' + month.toString().padStart(2, '0'));
	/* let minDate = $derived(formatDateForInput(new Date())); */

	function addTime({ y = 0, m = 0 }) {
		const [year, month] = expiresAt.split('-');
		expiresAt =
			(Number(year) + y).toString() + '-' + (Number(month) + m).toString().padStart(2, '0');
	}

	// Card Data para el 3D (Solo se actualiza al generar)
	let previewCard: IssuerMint = $derived({
		id: 'preview',
		title: 'Valor de la mejor mint del mundo',
		description: 'Descripción...',
		visualConfig: { effect: 'plastic', color: 'crimson' },
		issuerPublicKey: { kty: 'OKP', crv: 'Ed25519', x: '', y: '' } as JsonWebKey,
		signature: '',
		createdAt: Date.now(),
		expiresAt,
		status: 'active',
		totalUnits: 1,
		usedUnits: 0
	} as IssuerMint);

	function handleGeneratePreview() {
		if (!title) {
			alert('¡Tu carta necesita un nombre!');
			return;
		}

		if (totalUnits < 1) {
			alert('Debes emitir al menos 1 unidad.');
			return;
		}
		// Actualizamos el objeto que usa Card3D SOLO AHORA
		previewCard = {
			...previewCard,
			title,
			description,
			visualConfig: {
				effect,
				color
			},
			expiresAt,
			totalUnits,
			usedUnits: 0
		} as IssuerMint;
	}

	async function handleMint() {
		if (!$identity) return;

		if (totalUnits < 1) {
			alert('Debes emitir al menos 1 unidad.');
			return;
		}

		isMinting = true;

		try {
			await createAndMintCard($identity, {
				title,
				description,
				visualConfig: { effect, color },
				expiresAt,
				totalUnits
			});

			goto('/');
		} catch (e) {
			console.error('Error creando carta:', e);
			alert('Error al forjar la carta.');
		} finally {
			isMinting = false;
		}
	}

	function toggleContentEditor() {
		contentEditor = !contentEditor;
	}

	function toggleStylesEditor() {
		stylesEditor = !stylesEditor;
	}
</script>

<!-- IDEA:
		 Tener como una store con presets de texto y estilos para las cartas.
		 Ej. Cartas pareja con vale por una cena en pareja, un masaje, etc.
-->

<!-- TODO:
		 Cambiar el color y el efecto por presets bien pensados para el contraste y la estetica general.
-->

<Back />

<div class="h-svh overflow-clip">
	<Scene card={previewCard} />

	<div class="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex flex-col p-6">
		<div class="pointer-events-auto flex gap-2">
			<button
				class="rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold"
				onclick={toggleContentEditor}
			>
				<CollectionIcon class="size-5" />
			</button>

			<button
				class="rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold"
				onclick={toggleStylesEditor}
			>
				<CreateIcon class="size-5" />
			</button>

			<button
				class="flex-1 rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold"
				onclick={handleMint}
				disabled={isMinting}
			>
				{#if isMinting}
					Forjando...
				{:else}
					Forjar carta
				{/if}
			</button>
		</div>
	</div>
</div>

{#if contentEditor}
	<!-- <EditorContent
		bind:title
		bind:description
		bind:totalUnits
		bind:expiryDate
		{minDate}
		{addTime}
		closeModal={toggleContentEditor}
		{handleGeneratePreview}
	/> -->
	<EditorContent
		bind:title
		bind:description
		bind:totalUnits
		bind:expiresAt
		{addTime}
		closeModal={toggleContentEditor}
		{handleGeneratePreview}
	/>
{/if}

{#if stylesEditor}
	<EditorStyles bind:color bind:effect closeModal={toggleStylesEditor} {handleGeneratePreview} />
{/if}
