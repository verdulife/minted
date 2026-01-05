<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import CollectionGrid from '$lib/components/ui/CollectionGrid.svelte';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import type { Card } from '$lib/db';
	import Logo from '@/lib/assets/Logo.svelte';

	// Queries reactivas usando Dexie liveQuery
	let myCards = liveQuery(() => db.table('myCards').toArray());
	let receivedCards = liveQuery(() => db.table('receivedCards').toArray());

	let activeTab = $state<'mine' | 'received'>('mine');
	let selectedCard = $state<Card | null>(null);

	// Derivamos las cartas a mostrar según la pestaña y el filtro
	let currentCards = $derived(() => {
		return activeTab === 'mine' ? $myCards || [] : $receivedCards || [];
	});

	function handleCardClick(card: Card) {
		selectedCard = card;
	}

	function closeDetail() {
		selectedCard = null;
	}
</script>

<div class="min-h-dvh">
	<!-- HEADER -->
	<header class="sticky top-0 z-30 border-b border-light/10 bg-dark p-6">
		<div class="flex items-center justify-between">
			<Logo class="h-6" />
		</div>

		<!-- TABS -->
		<div class="mx-auto mt-6 flex max-w-md rounded-full bg-light/5 p-1 ring-1 ring-light/10">
			<button
				onclick={() => (activeTab = 'mine')}
				class="flex-1 rounded-full py-2 text-sm font-semibold transition-all"
				class:bg-light={activeTab === 'mine'}
				class:text-dark={activeTab === 'mine'}
				class:text-neutral-400={activeTab !== 'mine'}
			>
				Mías ({($myCards || []).length})
			</button>
			<button
				onclick={() => (activeTab = 'received')}
				class="flex-1 rounded-full py-2 text-sm font-semibold transition-all"
				class:bg-light={activeTab === 'received'}
				class:text-dark={activeTab === 'received'}
				class:text-neutral-400={activeTab !== 'received'}
			>
				Recibidas ({($receivedCards || []).length})
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-6xl pb-24">
		<!-- GRID -->
		<CollectionGrid cards={currentCards()} {activeTab} onCardClick={handleCardClick} />
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
				<Scene card={selectedCard} />
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
