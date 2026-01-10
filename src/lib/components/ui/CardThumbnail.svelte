<script lang="ts">
	import { type Mint, type IssuerMint } from '@/lib/db';
	import { isExpired } from '@/lib/logic';
	import { formatExpirationDate } from '@/lib/utils';

	interface Props {
		card: Mint;
		onClick?: (card: Mint) => void;
	}

	let { card, onClick }: Props = $props();

	// Helper to check if it's an issuer mint
	const issuerMint = $derived('totalUnits' in card ? (card as IssuerMint) : null);

	let bgColor = $derived(() => {
		if (card.visualConfig.effect === 'holographic') {
			return 'linear-gradient(60deg,cyan,lightgreen,magenta)';
		} else {
			return `linear-gradient(${card.visualConfig.color})`;
		}
	});
	let textColor = $derived(() => {
		if (card.visualConfig.effect === 'holographic') return 'black';
		else if (bgColor() === 'white') return 'black';
		else if (bgColor() === 'goldenrod') return 'black';
		else return 'white';
	});
</script>

<button
	style="--bg-color: {bgColor()}; --text-color: {textColor()}"
	class="relative flex aspect-63/88 h-full flex-col items-center justify-between overflow-hidden rounded-xl border-t border-r border-light/20 [background-image:var(--bg-color)] p-3 text-(--text-color) shadow shadow-black/50"
	class:opacity-25={isExpired(card.expiresAt)}
	onclick={() => onClick?.(card)}
>
	<div class="flex size-full flex-col text-left">
		<p class="text-lg leading-tight font-bold">
			{card.title}
		</p>
		<div class="mt-auto flex justify-between font-mono text-[11px]">
			<p>{formatExpirationDate(card.expiresAt)}</p>

			{#if issuerMint && issuerMint.totalUnits > 1}
				<p>{issuerMint.totalUnits}u</p>
			{/if}
		</div>
		<hr class="my-1.5" />
		<p class="text-[9px]">
			{card.description}
		</p>
	</div>
</button>
