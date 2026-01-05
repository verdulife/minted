<script lang="ts">
	import type { Card } from '@/lib/db';
	import CardThumbnail from './CardThumbnail.svelte';

	interface Props {
		cards: Card[];
		onCardClick?: (card: Card) => void;
	}

	let { cards, onCardClick }: Props = $props();
</script>

{#if cards.length === 0}
	<div class="flex flex-col items-center justify-center py-20 text-center text-gray-500">
		<div class="mb-4 text-6xl opacity-20">🃏</div>
		<p class="text-lg">No hay cartas en esta categoría todavía.</p>
	</div>
{:else}
	<div
		class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
	>
		{#each cards as card (card.id)}
			<CardThumbnail {card} onClick={onCardClick} />
		{/each}
	</div>
{/if}
