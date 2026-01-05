<script lang="ts">
	import type { Card } from '@/lib/db';

	interface Props {
		card: Card;
		activeTab: 'mine' | 'received';
		onClick?: (card: Card) => void;
	}

	let { card, onClick }: Props = $props();
</script>

<button
	onclick={() => onClick?.(card)}
	class="group relative aspect-63/88 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-lg transition-all hover:scale-105 hover:border-white/30 hover:shadow-white/5 active:scale-95"
>
	<div
		class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
	>
		<div class="absolute right-0 bottom-2 left-0 px-2 text-center">
			<p class="truncate text-[10px] font-bold tracking-tight text-white uppercase">{card.title}</p>
		</div>
	</div>
</button>
