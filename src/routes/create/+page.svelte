<script lang="ts">
	import { type IssuerMint, type Mint } from '@/lib/db';
	import { goto } from '$app/navigation';
	import { identity } from '@/lib/stores';
	import { createAndMintCard } from '@/lib/crypto';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import { EXPIRATION_PRESETS } from '@/lib/consts';
	import CreateIcon from '@/lib/assets/CreateIcon.svelte';

	// --- Estado ---
	let step: 'editor' | 'preview' = $state('editor');

	// Inputs del usuario
	let title = $state('Ejemplo de valor de carta');
	let description = $state('Ejemplo de anotaciones con un texto ligeramente largo.');
	let color = $state('black');
	let effect: 'plastic' | 'metalized' | 'holographic' | 'mirror' = $state('plastic');
	let totalUnits = $state(1);

	let isMinting = $state(false);

	// Expiración
	const formatDateForInput = (date: Date) => {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	};

	let expiryDate = $state(formatDateForInput(new Date(Date.now() + EXPIRATION_PRESETS['1W'])));
	let minDate = $derived(formatDateForInput(new Date()));

	function addTime(ms: number) {
		const current = expiryDate ? new Date(expiryDate).getTime() : Date.now();
		expiryDate = formatDateForInput(new Date(current + ms));
	}

	// Card Data para el 3D (Solo se actualiza al generar)
	let previewCard: IssuerMint = $state({
		id: 'preview',
		title: 'Título de Carta',
		description: 'Descripción...',
		visualConfig: { effect: 'plastic', color: 'black' },
		issuerPublicKey: { kty: 'OKP', crv: 'Ed25519', x: '', y: '' } as JsonWebKey,
		signature: '',
		createdAt: Date.now(),
		expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
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
			expiresAt: new Date(expiryDate).getTime(),
			totalUnits,
			usedUnits: 0
		} as IssuerMint;

		step = 'preview';
	}

	function handleEdit() {
		step = 'editor';
	}

	async function handleMint() {
		if (!$identity) return;

		if (totalUnits < 1) {
			alert('Debes emitir al menos 1 unidad.');
			return;
		}

		isMinting = true;
		try {
			const card = await createAndMintCard($identity, {
				title,
				description,
				visualConfig: { effect, color },
				expiresAt: new Date(expiryDate).getTime(),
				totalUnits
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

			<label class="flex flex-col gap-2">
				<p class="text-xs font-semibold text-neutral-400">Unidades a emitir</p>
				<input
					type="number"
					bind:value={totalUnits}
					min="1"
					max="1000"
					placeholder="1"
					class="w-full rounded-lg border border-light/10 bg-light/5 p-3 font-medium transition-colors focus:border-light/70 focus:outline-none"
					class:border-red-500={totalUnits < 1}
				/>
				<div class="flex flex-col gap-1">
					{#if totalUnits < 1}
						<p class="text-[10px] font-bold text-red-500">Mínimo 1 unidad requerida</p>
					{:else}
						<p class="text-[10px] text-neutral-500">
							Define cuántas unidades de esta carta podrán ser canjeadas.
						</p>
					{/if}
				</div>
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

			<div class="flex flex-col gap-4">
				<div class="flex items-end justify-between">
					<p class="text-xs font-semibold text-neutral-400">Fecha de Caducidad</p>
					{#if !expiryDate || new Date(expiryDate).getTime() <= Date.now()}
						<p class="text-[10px] font-bold text-red-500 uppercase">Fecha inválida</p>
					{/if}
				</div>

				<div class="flex flex-col gap-3">
					<input
						type="datetime-local"
						bind:value={expiryDate}
						min={minDate}
						class="w-full rounded-lg border border-light/10 bg-light/5 p-3 font-medium transition-colors focus:border-light/70 focus:outline-none"
					/>

					<div class="flex flex-wrap gap-2">
						<button
							onclick={() => addTime(EXPIRATION_PRESETS['24H'])}
							class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
						>
							+24H
						</button>
						<button
							onclick={() => addTime(EXPIRATION_PRESETS['1W'])}
							class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
						>
							+1 SEMANA
						</button>
						<button
							onclick={() => addTime(EXPIRATION_PRESETS['1M'])}
							class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
						>
							+1 MES
						</button>
						<button
							onclick={() => addTime(EXPIRATION_PRESETS['1Y'])}
							class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
						>
							+1 AÑO
						</button>
					</div>
				</div>
			</div>

			<button
				onclick={handleGeneratePreview}
				disabled={!expiryDate || new Date(expiryDate).getTime() <= Date.now() || totalUnits < 1}
				class="mb-20 rounded-lg bg-light py-4 font-semibold text-dark disabled:opacity-50"
			>
				Ver carta
			</button>
		</main>
	{/if}

	{#if step === 'preview'}
		<div class="relative h-svh overflow-clip">
			<Scene card={previewCard} />

			<div class="pointer-events-none absolute right-0 bottom-17 left-0 z-20 flex flex-col p-6">
				<div class="pointer-events-auto flex gap-4">
					<button
						class="rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold"
						onclick={handleEdit}
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
	{/if}
</div>
