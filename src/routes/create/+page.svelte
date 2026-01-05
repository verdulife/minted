<script lang="ts">
	import { goto } from '$app/navigation';
	import { identity } from '@/lib/stores';
	import { createAndMintCard } from '@/lib/crypto';
	import { AppDatabase } from '@/lib/db';
	import Scene3D from '@/lib/components/3d/Scene3D.svelte';
	import RaritySelector from '@/lib/components/ui/RaritySelector.svelte';
	import type { Card } from '@/lib/db';

	// --- Estado ---
	let step: 'editor' | 'preview' = $state('editor');

	// Inputs del usuario
	let title = $state('');
	let description = $state('');
	let rarity: 'common' | 'rare' | 'legendary' = $state('common');
	let color = $state('#cccccc');

	let isMinting = $state(false);

	// Card Data para el 3D (Solo se actualiza al generar)
	let previewCard: Card = $state({
		id: 'preview',
		title: 'Título de Carta',
		description: 'Descripción...',
		visualConfig: { rarity: 'common', effect: 'standard', color: '#cccccc' },
		issuerPublicKey: { kty: 'OKP', crv: 'Ed25519', x: '', y: '' } as JsonWebKey,
		signature: '',
		createdAt: Date.now(),
		used: false
	} as unknown as Card);

	// Actualizar color por defecto al cambiar rareza (solo si estamos en editor)
	$effect(() => {
		if (step === 'editor') {
			if (rarity === 'common') color = '#cccccc';
			if (rarity === 'rare') color = '#3b82f6';
			if (rarity === 'legendary') color = '#eab308';
		}
	});

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
				rarity,
				effect: 'standard',
				color
			}
		} as unknown as Card; // Casting necesario por tipo parcial

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
				visualConfig: { rarity, effect: 'standard', color }
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

<div class="relative h-dvh w-full overflow-hidden bg-[#050505] font-sans text-white">
	<!-- BACKGROUND: Escena 3D (Fullscreen) -->
	<div
		class="absolute inset-0 z-0 h-dvh w-full transition-all duration-700"
		class:blur-md={step === 'editor'}
		class:opacity-50={step === 'editor'}
	>
		<Scene3D card={previewCard} />
	</div>

	<!-- HEADER -->
	<header
		class="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-6"
	>
		<div class="pointer-events-auto">
			<a
				href="/"
				class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl backdrop-blur-md transition-colors hover:bg-white/20"
			>
				←
			</a>
		</div>
		<h1 class="text-xl font-bold tracking-widest text-white/50 uppercase">Forja de Cartas</h1>
		<div class="w-10"></div>
	</header>

	<!-- MODO EDITOR: Formulario Central -->
	{#if step === 'editor'}
		<div class="absolute inset-0 z-20 flex items-center justify-center p-4">
			<div
				class="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/80 p-8 shadow-2xl backdrop-blur-xl transition-all"
			>
				<div class="text-center">
					<h2 class="mb-2 text-3xl font-bold text-white">Diseña tu Carta</h2>
					<p class="text-sm text-gray-400">Define los atributos de tu nuevo coleccionable</p>
				</div>

				<div class="space-y-6">
					<!-- Título -->
					<div>
						<label
							for="card-title"
							class="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Nombre</label
						>
						<input
							id="card-title"
							type="text"
							bind:value={title}
							placeholder="Ej. Dragón Etereo"
							class="w-full border-b-2 border-white/20 bg-transparent px-0 py-2 text-xl font-bold text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
							maxlength="25"
						/>
					</div>

					<!-- Descripción -->
					<div>
						<label
							for="card-desc"
							class="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase"
							>Descripción / Lore</label
						>
						<textarea
							id="card-desc"
							bind:value={description}
							placeholder="Cuenta su historia..."
							rows="3"
							class="w-full resize-none rounded-lg bg-white/5 p-4 text-sm text-gray-200 placeholder-gray-600 transition-colors focus:bg-white/10 focus:outline-none"
							maxlength="140"
						></textarea>
						<div class="mt-1 text-right text-[10px] text-gray-600">{description.length}/140</div>
					</div>

					<!-- Rareza y Color -->
					<div class="flex gap-4">
						<div class="flex-1">
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase"
								>Rareza</label
							>
							<RaritySelector selected={rarity} onSelect={(r) => (rarity = r)} />
						</div>
						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase"
								>Color</label
							>
							<div class="h-10 w-full overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
								<input
									type="color"
									bind:value={color}
									class="-mt-1 -ml-1 h-12 w-[120%] cursor-pointer"
								/>
							</div>
						</div>
					</div>
				</div>

				<button
					onclick={handleGeneratePreview}
					class="w-full rounded-xl bg-white py-4 text-lg font-bold text-black shadow-lg shadow-white/10 transition-all hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98]"
				>
					Generar Vista Previa →
				</button>
			</div>
		</div>
	{/if}

	<!-- MODO PREVIEW: Botones de Acción -->
	{#if step === 'preview'}
		<div
			class="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center justify-end gap-4 bg-linear-to-t from-black via-black/80 to-transparent p-6 pt-24 pb-12"
		>
			<div class="pointer-events-auto flex w-full max-w-md gap-4">
				<button
					onclick={handleEdit}
					class="flex-1 rounded-xl border border-white/20 bg-black/40 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
				>
					← Editar
				</button>

				<button
					onclick={handleMint}
					disabled={isMinting}
					class="flex-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 py-4 font-bold text-white shadow-xl shadow-purple-900/40 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:grayscale"
				>
					{#if isMinting}
						⏳ Forjando...
					{:else}
						✨ FORJAR CARTA FINAL
					{/if}
				</button>
			</div>

			<p class="text-center text-xs text-gray-500">
				Gira la carta para inspeccionarla. Al forjar, se guardará en tu colección permanentemente.
			</p>
		</div>
	{/if}
</div>
