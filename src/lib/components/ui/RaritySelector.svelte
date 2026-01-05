<script lang="ts">
	interface Props {
		selected: 'common' | 'rare' | 'legendary';
		onSelect: (rarity: 'common' | 'rare' | 'legendary') => void;
	}
	let { selected, onSelect }: Props = $props();

	const options = [
		{ id: 'common', label: 'Common', color: 'bg-gray-500', border: 'border-gray-500' },
		{ id: 'rare', label: 'Rare', color: 'bg-blue-500', border: 'border-blue-500' },
		{ id: 'legendary', label: 'Legendary', color: 'bg-yellow-500', border: 'border-yellow-500' }
	] as const;
</script>

<div class="grid grid-cols-3 gap-3">
	{#each options as opt}
		<button
			onclick={() => onSelect(opt.id)}
			class="relative overflow-hidden rounded-lg border px-4 py-3 text-sm font-semibold transition-all
      {selected === opt.id
				? `${opt.border} ${opt.color}/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] ring-1 ring-white/50`
				: 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			<div class="absolute inset-0 opacity-20 {opt.color} blur-xl" />
			<span class="relative z-10">{opt.label}</span>

			{#if selected === opt.id}
				<div class="absolute -top-2 -right-2 h-6 w-6 rotate-45 bg-white shadow-sm" />
			{/if}
		</button>
	{/each}
</div>
