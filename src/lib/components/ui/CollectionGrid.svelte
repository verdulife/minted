<script lang="ts">
	import { type Mint } from '@/lib/db';
	import CardThumbnail from '@/lib/components/ui/CardThumbnail.svelte';

	interface Props {
		cards: Mint[];
		activeTab: 'mine' | 'received';
		subTabActive: string;
		onCardClick?: (card: Mint) => void;
	}

	let { cards, activeTab, subTabActive, onCardClick }: Props = $props();

	console.log(subTabActive);
</script>

{#if cards.length === 0}
	<div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
		{#if activeTab === 'mine'}
			{#if subTabActive === 'Vigentes'}
				<p class="text-sm text-neutral-400">No has creado ninguna carta todavía</p>

				<a href="/create" class="rounded-md bg-light px-6 py-3 font-semibold text-dark">
					Crea tu primera carta
				</a>
			{:else if subTabActive === 'Finalizadas'}
				<p class="text-sm text-neutral-400">No tienes cartas caducadas o canjeadas</p>
			{/if}
		{:else if activeTab === 'received'}
			{#if subTabActive === 'Disponibles'}
				<p class="text-sm text-neutral-400">No has recibido ninguna carta todavía</p>

				<a href="/get" class="rounded-md bg-light px-6 py-3 font-semibold text-dark">
					Recibe tu primera carta
				</a>
			{:else if subTabActive === 'Usadas'}
				<p class="text-sm text-neutral-400">No has gastado ninguna carta todavía</p>
			{/if}
		{/if}
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
