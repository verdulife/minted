<script lang="ts">
	import type { Card } from '@/lib/db';
	import { goto } from '$app/navigation';
	import { identity } from '@/lib/stores';
	import { createAndMintCard } from '@/lib/crypto';
	import Scene from '@/lib/components/3d/Scene.svelte';

	// --- Estado ---
	let step: 'editor' | 'preview' = $state('preview');

	// Inputs del usuario
	let title = $state('Ejemplo de valor de carta');
	let description = $state('Ejemplo de anotaciones con un texto ligeramente largo.');
	let color = $state('black');
	let effect: 'plastic' | 'metalized' | 'holographic' | 'mirror' = $state('plastic');

	let isMinting = $state(false);

	// Card Data para el 3D (Solo se actualiza al generar)
	let previewCard: Card = $state({
		id: 'preview',
		title: 'Título de Carta',
		description: 'Descripción...',
		visualConfig: { effect: 'plastic', color: 'black' },
		issuerPublicKey: { kty: 'OKP', crv: 'Ed25519', x: '', y: '' } as JsonWebKey,
		signature: '',
		createdAt: Date.now(),
		used: false
	} as Card);

	function handleGeneratePreview() {
		if (!title) {
			alert('¡Tu carta necesita un nombre!');
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
			}
		} as Card;

		step = 'preview';
	}

	function handleEdit() {
		step = 'editor';
	}

	async function handleMint() {
		if (!$identity) return;
		isMinting = true;
		try {
			const card = await createAndMintCard($identity, {
				title,
				description,
				visualConfig: { effect, color }
			});
			console.log('✅ Carta creada:', card);
			goto('/');
		} catch (e) {
			console.error('Error creando carta:', e);
			alert('Error al forjar la carta.');
		} finally {
			isMinting = false;
		}
	}
</script>

<!-- IDEA:
		 Tener como una store con presets de texto y estilos para las cartas.
		 Ej. Cartas pareja con vale por una cena en pareja, un masaje, etc.
-->

<!-- TODO:
		 Cambiar el color y el efecto por presets bien pensados para el contraste y la estetica general.
-->

<div class="relative min-h-svh overflow-clip">
	{#if step === 'editor'}
		<header class="mt-6 border-b border-light/10 p-6">
			<h1 class="mb-2 text-3xl font-bold text-white">Creador</h1>
			<p class="text-sm text-neutral-400">Define los atributos tu nueva <strong>mint</strong></p>
		</header>

		<main class="flex flex-col gap-6 p-6">
			<label class="flex flex-col gap-2">
				<div class="flex items-end justify-between">
					<p class="text-xs font-semibold text-neutral-400">Valor de la mint</p>
					<p class="text-xs text-neutral-400">{title.length}/75</p>
				</div>

				<textarea
					bind:value={title}
					rows="2"
					placeholder="Ej. Vale por una cena en pareja"
					class="w-full resize-none rounded-lg border border-light/10 bg-light/5 p-3 font-medium placeholder-neutral-600 transition-colors focus:border-light/70 focus:outline-none"
					maxlength="75"
				></textarea>
			</label>

			<label class="flex flex-col gap-2">
				<div class="flex items-end justify-between">
					<p class="text-xs font-semibold text-neutral-400">Anotaciones</p>
					<p class="text-xs text-neutral-400">{description.length}/140</p>
				</div>

				<textarea
					bind:value={description}
					placeholder="Ej. Solo válido de lunes a sábado"
					rows="4"
					class="w-full resize-none rounded-lg border border-light/10 bg-light/5 p-3 font-medium placeholder-neutral-600 transition-colors focus:border-light/70 focus:outline-none"
					maxlength="140"
				></textarea>
			</label>

			<div class="flex flex-col gap-4">
				<p class="text-xs font-semibold text-neutral-400">Color</p>

				<div class="flex gap-2">
					<!-- Rojo -->
					<label
						class="size-12 rounded-full border-light p-0.5"
						class:border-2={color === 'tomato'}
					>
						<div class="flex size-full rounded-full bg-[tomato]"></div>
						<input class="hidden" type="radio" bind:group={color} value="tomato" />
					</label>

					<!-- Azul -->
					<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'blue'}>
						<div class="flex size-full rounded-full bg-[blue]"></div>
						<input class="hidden" type="radio" bind:group={color} value="blue" />
					</label>

					<!-- Dorado -->
					<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'gold'}>
						<div class="flex size-full rounded-full bg-[gold]"></div>
						<input class="hidden" type="radio" bind:group={color} value="gold" />
					</label>

					<!-- Negro -->
					<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'black'}>
						<div class="flex size-full rounded-full bg-[#222]"></div>
						<input class="hidden" type="radio" bind:group={color} value="black" />
					</label>

					<!-- Blanco -->
					<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'white'}>
						<div class="flex size-full rounded-full bg-[white]"></div>
						<input class="hidden" type="radio" bind:group={color} value="white" />
					</label>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<p class="text-xs font-semibold text-neutral-400">Efecto</p>

				<div class="grid grid-cols-2 gap-2">
					<!-- Plástico brillante -->
					<label class="h-12 rounded-full border-light p-0.5" class:border-2={effect === 'plastic'}>
						<div class="flex size-full items-center justify-center rounded-full bg-light/10">
							Plástico brillante
						</div>
						<input class="hidden" type="radio" bind:group={effect} value="plastic" />
					</label>

					<!-- Metalizado -->
					<label
						class="h-12 rounded-full border-light p-0.5"
						class:border-2={effect === 'metalized'}
					>
						<div class="flex size-full items-center justify-center rounded-full bg-light/10">
							Metalizado
						</div>
						<input class="hidden" type="radio" bind:group={effect} value="metalized" />
					</label>

					<!-- Holográfico -->
					<label
						class="h-12 rounded-full border-light p-0.5"
						class:border-2={effect === 'holographic'}
					>
						<div class="flex size-full items-center justify-center rounded-full bg-light/10">
							Holográfico
						</div>
						<input class="hidden" type="radio" bind:group={effect} value="holographic" />
					</label>

					<!-- Espejo -->
					<label class="h-12 rounded-full border-light p-0.5" class:border-2={effect === 'mirror'}>
						<div class="flex size-full items-center justify-center rounded-full bg-light/10">
							Espejo
						</div>
						<input class="hidden" type="radio" bind:group={effect} value="mirror" />
					</label>
				</div>
			</div>

			<button
				onclick={handleGeneratePreview}
				class="mb-20 rounded-lg bg-light py-4 font-semibold text-dark"
			>
				Ver carta
			</button>
		</main>
	{/if}

	{#if step === 'preview'}
		<div class="relative h-svh overflow-clip">
			<Scene card={previewCard} />

			<div
				class="pointer-events-none absolute right-0 bottom-17 left-0 z-20 flex flex-col gap-20 p-6"
			>
				<p class="text-center text-xs text-gray-500">Toca 2 veces la carta para girarla.</p>

				<div class="pointer-events-auto flex gap-4">
					<button
						class="rounded-xl border border-light/10 bg-black/40 px-8 py-4 text-sm font-semibold"
						onclick={handleEdit}
					>
						Editar
					</button>

					<button
						class="flex-1 rounded-xl bg-light px-8 py-4 text-sm font-semibold text-dark"
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
	{/if}
</div>
