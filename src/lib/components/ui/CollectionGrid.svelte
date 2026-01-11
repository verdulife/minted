<script lang="ts">
	import { type Mint } from '@/lib/db';
	import CardThumbnail from '@/lib/components/ui/CardThumbnail.svelte';

	interface Props {
		cards: Mint[];
		activeTab: 'mine' | 'received';
		onCardClick?: (card: Mint) => void;
	}

	let { cards, activeTab, onCardClick }: Props = $props();

	function dateSort(a: Mint, b: Mint) {
		return b.createdAt - a.createdAt;
	}
</script>

{#if cards.length === 0}
	<div class="flex flex-col items-center justify-center gap-4 pt-20 text-center">
		{#if activeTab === 'mine'}
			<p class="text-sm text-neutral-400">No has creado ninguna carta todavía</p>

			<a href="/create" class="rounded-md bg-light px-6 py-3 font-semibold text-dark">
				Crea tu primera carta
			</a>
		{:else if activeTab === 'received'}
			<p class="text-sm text-neutral-400">No has recibido ninguna carta todavía</p>

			<a href="/get" class="rounded-md bg-light px-6 py-3 font-semibold text-dark">
				Recibe tu primera carta
			</a>
		{/if}
	</div>
{:else}
	<div
		class="grid grid-cols-2 gap-2.5 px-4 pt-0 pb-30 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
	>
		{#each cards.sort(dateSort) as card (card.id)}
			<CardThumbnail {card} onClick={onCardClick} />
		{/each}
	</div>
{/if}
