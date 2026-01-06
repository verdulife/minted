<script lang="ts">
	import { type Mint, type IssuerMint } from '@/lib/db';
	import Logo from '@/lib/assets/Logo.svelte';

	interface Props {
		card: Mint;
		onClick?: (card: Mint) => void;
	}

	let { card, onClick }: Props = $props();

	// Helper to check if it's an issuer mint
	const issuerMint = $derived('totalUnits' in card ? (card as IssuerMint) : null);

	let bgColor = $derived(card.visualConfig.color);
	let textColor = $derived(card.visualConfig.color === 'black' ? 'white' : 'black');
</script>

<button
	style="--bg-color: {bgColor}"
	class="aspect-63/88 overflow-hidden rounded-xl bg-light/40 shadow-lg"
	onclick={() => onClick?.(card)}
>
	<div
		style="--text-color: {textColor}"
		class="flex h-full flex-col items-center justify-between border border-light/10 bg-linear-to-br from-(--bg-color)/40 to-(--bg-color)/80 p-5 py-6 text-(--text-color)"
	>
		<div class="w-full">
			<p class="text-left text-lg leading-tight font-bold">
				{card.title}
			</p>
			{#if issuerMint}
				<p class="mt-1 text-left text-[10px] font-bold opacity-60">
					{issuerMint.usedUnits}/{issuerMint.totalUnits} USADOS
				</p>
			{/if}
		</div>

		<Logo class="h-3 opacity-50" />
	</div>
</button>
