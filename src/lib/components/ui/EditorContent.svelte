<script lang="ts">
	import { EXPIRATION_PRESETS } from '@/lib/consts';
	import Modal from './Modal.svelte';

	interface Props {
		title: string;
		description: string;
		totalUnits: number;
		expiryDate: string;
		minDate: string;
		addTime: (time: number) => void;
		closeModal: () => void;
		handleGeneratePreview: () => void;
	}

	let {
		title = $bindable(),
		description = $bindable(),
		totalUnits = $bindable(),
		expiryDate = $bindable(),
		minDate,
		addTime,
		closeModal,
		handleGeneratePreview
	}: Props = $props();

	let year = $derived(new Date(expiryDate).getFullYear());
	let month = $derived(new Date(expiryDate).getMonth());
	let yearMonth = $derived(`${year}-${String(month + 1).padStart(2, '0')}`);

	function handleApply() {
		handleGeneratePreview();
		closeModal();
	}
</script>

<Modal {closeModal}>
	<header class="mt-6 border-b border-light/10 p-6">
		<h1 class="mb-2 text-3xl font-bold text-white">Creador</h1>
		<p class="text-sm text-neutral-400">Define los atributos tu nueva <strong>mint</strong></p>
	</header>

	<main class="flex flex-col gap-6 p-6">
		<label class="flex flex-col gap-2">
			<div class="flex items-end justify-between">
				<p class="text-xs font-semibold text-neutral-400">Valor de la mint</p>
				<p class="text-xs text-neutral-400">{title.length}/75</p>
			</div>

			<textarea
				bind:value={title}
				rows="2"
				placeholder="Ej. Vale por una cena en pareja"
				class="w-full resize-none rounded-lg border border-light/10 bg-light/5 p-3 font-medium placeholder-neutral-600 transition-colors focus:border-light/70 focus:outline-none"
				maxlength="75"
			></textarea>
		</label>

		<label class="flex flex-col gap-2">
			<div class="flex items-end justify-between">
				<p class="text-xs font-semibold text-neutral-400">Anotaciones</p>
				<p class="text-xs text-neutral-400">{description.length}/75</p>
			</div>

			<textarea
				bind:value={description}
				placeholder="Ej. Solo válido de lunes a sábado"
				rows="4"
				class="w-full resize-none rounded-lg border border-light/10 bg-light/5 p-3 font-medium placeholder-neutral-600 transition-colors focus:border-light/70 focus:outline-none"
				maxlength="75"
			></textarea>
		</label>

		<label class="flex flex-col gap-2">
			<p class="text-xs font-semibold text-neutral-400">Unidades a emitir</p>
			<input
				type="number"
				bind:value={totalUnits}
				min="1"
				max="1000"
				placeholder="1"
				class="w-full rounded-lg border border-light/10 bg-light/5 p-3 font-medium transition-colors focus:border-light/70 focus:outline-none"
				class:border-red-500={totalUnits < 1}
			/>
			<div class="flex flex-col gap-1">
				{#if totalUnits < 1}
					<p class="text-[10px] font-bold text-red-500">Mínimo 1 unidad requerida</p>
				{:else}
					<p class="text-[10px] text-neutral-500">
						Define cuántas unidades de esta carta podrán ser canjeadas.
					</p>
				{/if}
			</div>
		</label>

		<div class="flex w-full flex-col gap-4">
			<div class="flex items-end justify-between">
				<p class="text-xs font-semibold text-neutral-400">Fecha de Caducidad</p>
				{#if !expiryDate || new Date(expiryDate).getTime() <= Date.now()}
					<p class="text-[10px] font-bold text-red-500 uppercase">Fecha inválida</p>
				{/if}
			</div>

			<label class="flex w-full flex-col gap-3">
				<input
					type="month"
					bind:value={yearMonth}
					min={minDate}
					class="w-full max-w-full appearance-none rounded-lg border border-light/10 bg-light/5 p-3 font-medium outline-none focus:border-light/70"
				/>

				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => addTime(EXPIRATION_PRESETS['1M'])}
						class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
					>
						+1 Mes
					</button>
					<button
						onclick={() => addTime(EXPIRATION_PRESETS['1Y'])}
						class="flex-1 rounded-full border border-light/10 bg-light/5 py-2 text-[10px] font-bold transition-all hover:bg-light/10 focus:bg-light/20 focus:outline-none active:scale-95"
					>
						+1 Año
					</button>
				</div>
			</label>
		</div>
	</main>

	<footer
		class="sticky bottom-0 z-50 flex w-full items-center justify-center bg-linear-to-b from-transparent to-dark p-6"
	>
		<button
			onclick={handleApply}
			disabled={!expiryDate || new Date(expiryDate).getTime() <= Date.now() || totalUnits < 1}
			class="w-full rounded-full border border-light/10 bg-dark/70 p-4 font-semibold backdrop-blur disabled:cursor-not-allowed disabled:text-neutral-600"
		>
			Aplicar cambios
		</button>
	</footer>
</Modal>
