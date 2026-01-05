<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import CollectionGrid from '$lib/components/ui/CollectionGrid.svelte';
	import Scene3D from '$lib/components/3d/Scene3D.svelte';
	import type { Card } from '$lib/db';

	// Queries reactivas usando Dexie liveQuery
	let myCards = liveQuery(() => db.table('myCards').toArray());
	let receivedCards = liveQuery(() => db.table('receivedCards').toArray());

	let activeTab = $state<'mine' | 'received'>('mine');
	let selectedLevel = $state<'all' | 'common' | 'rare' | 'legendary'>('all');

	let selectedCard = $state<Card | null>(null);

	// Derivamos las cartas a mostrar según la pestaña y el filtro
	let currentCards = $derived(() => {
		const source = activeTab === 'mine' ? $myCards || [] : $receivedCards || [];
		if (selectedLevel === 'all') return source;
		return source.filter((c) => c.visualConfig.rarity === selectedLevel);
	});

	function handleCardClick(card: Card) {
		selectedCard = card;
	}

	function closeDetail() {
		selectedCard = null;
	}
</script>

<div class="min-h-dvh w-full bg-[#050505] font-sans text-white">
	<!-- HEADER -->
	<header class="sticky top-0 z-30 border-b border-white/5 bg-black/60 p-4 backdrop-blur-xl">
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<a
				href="/"
				class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
			>
				←
			</a>
			<h1 class="text-xl font-bold tracking-widest uppercase opacity-80">Mi Colección</h1>
			<div class="w-10"></div>
		</div>

		<!-- TABS -->
		<div class="mx-auto mt-6 flex max-w-md rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
			<button
				onclick={() => (activeTab = 'mine')}
				class="flex-1 rounded-lg py-2 text-sm font-bold transition-all"
				class:bg-white={activeTab === 'mine'}
				class:text-black={activeTab === 'mine'}
				class:text-gray-400={activeTab !== 'mine'}
			>
				Mías ({($myCards || []).length})
			</button>
			<button
				onclick={() => (activeTab = 'received')}
				class="flex-1 rounded-lg py-2 text-sm font-bold transition-all"
				class:bg-white={activeTab === 'received'}
				class:text-black={activeTab === 'received'}
				class:text-gray-400={activeTab !== 'received'}
			>
				Recibidas ({($receivedCards || []).length})
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-6xl pb-24">
		<!-- FILTROS RÁPIDOS (Opcional) -->
		<div class="scrollbar-hide flex gap-2 overflow-x-auto p-4">
			{#each ['all', 'common', 'rare', 'legendary'] as level}
				<button
					onclick={() => (selectedLevel = level as any)}
					class="rounded-full border border-white/10 px-4 py-1.5 text-xs font-bold whitespace-nowrap uppercase transition-all"
					class:bg-white={selectedLevel === level}
					class:text-black={selectedLevel === level}
					class:text-gray-500={selectedLevel !== level}
				>
					{level}
				</button>
			{/each}
		</div>

		<!-- GRID -->
		<CollectionGrid cards={currentCards()} onCardClick={handleCardClick} />
	</main>

	<!-- DETAIL MODAL (MODO 3D) -->
	{#if selectedCard}
		<div
			class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
		>
			<!-- Close Header -->
			<div class="absolute top-0 right-0 left-0 flex items-center justify-between p-6">
				<button
					onclick={closeDetail}
					class="h-10 w-10 rounded-full bg-white/10 text-xl transition-all hover:bg-white/20"
					>✕</button
				>
				<h2 class="text-lg font-bold tracking-widest text-white/50 uppercase">
					{selectedCard.title}
				</h2>
				<div class="w-10"></div>
			</div>

			<!-- 3D Scene -->
			<div class="h-[60dvh] w-full">
				<Scene3D card={selectedCard} />
			</div>

			<!-- Meta & Actions -->
			<div class="w-full max-w-md space-y-4 p-8 text-center">
				<p class="text-sm text-gray-400 italic">"{selectedCard.description}"</p>

				<div class="flex gap-4 pt-4">
					<button
						class="flex-1 rounded-xl border border-white/20 bg-white/5 py-4 font-bold text-white transition-all hover:bg-white/10"
					>
						BORRAR
					</button>
					<button
						class="flex-2 rounded-xl bg-white py-4 font-bold text-black transition-all hover:bg-gray-200"
					>
						COMPARTIR QR
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
