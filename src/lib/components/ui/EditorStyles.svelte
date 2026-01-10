<script lang="ts">
	import Modal from './Modal.svelte';

	interface Props {
		color: string;
		effect: string;
		closeModal: () => void;
		handleGeneratePreview: () => void;
	}

	let {
		color = $bindable(),
		effect = $bindable(),
		closeModal,
		handleGeneratePreview
	}: Props = $props();

	function handleApply() {
		handleGeneratePreview();
		closeModal();
	}
</script>

<Modal {closeModal}>
	<main class="flex flex-col gap-6 p-6">
		<div class="flex flex-col gap-4">
			<p class="text-xs font-semibold text-neutral-400">Color</p>

			<div class="flex gap-2">
				<!-- Rojo -->
				<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'crimson'}>
					<div class="flex size-full rounded-full bg-[crimson]"></div>
					<input class="hidden" type="radio" bind:group={color} value="crimson" />
				</label>

				<!-- Azul -->
				<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'blue'}>
					<div class="flex size-full rounded-full bg-[blue]"></div>
					<input class="hidden" type="radio" bind:group={color} value="blue" />
				</label>

				<!-- Dorado -->
				<label
					class="size-12 rounded-full border-light p-0.5"
					class:border-2={color === 'goldenrod'}
				>
					<div class="flex size-full rounded-full bg-[goldenrod]"></div>
					<input class="hidden" type="radio" bind:group={color} value="goldenrod" />
				</label>

				<!-- Negro -->
				<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'black'}>
					<div class="flex size-full rounded-full bg-[#222]"></div>
					<input class="hidden" type="radio" bind:group={color} value="black" />
				</label>

				<!-- Blanco -->
				<label class="size-12 rounded-full border-light p-0.5" class:border-2={color === 'white'}>
					<div class="flex size-full rounded-full bg-[white]"></div>
					<input class="hidden" type="radio" bind:group={color} value="white" />
				</label>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<p class="text-xs font-semibold text-neutral-400">Efecto</p>

			<div class="grid grid-cols-2 gap-2">
				<!-- Plastic -->
				<label class="h-12 rounded-full border-light p-0.5" class:border-2={effect === 'plastic'}>
					<div class="flex size-full items-center justify-center rounded-full bg-light/10">
						Plastic
					</div>
					<input class="hidden" type="radio" bind:group={effect} value="plastic" />
				</label>

				<!-- Metal -->
				<label class="h-12 rounded-full border-light p-0.5" class:border-2={effect === 'metalized'}>
					<div class="flex size-full items-center justify-center rounded-full bg-light/10">
						Metal
					</div>
					<input class="hidden" type="radio" bind:group={effect} value="metalized" />
				</label>

				<!-- Holo -->
				<label
					class="h-12 rounded-full border-light p-0.5"
					class:border-2={effect === 'holographic'}
				>
					<div class="flex size-full items-center justify-center rounded-full bg-light/10">
						Holo
					</div>
					<input class="hidden" type="radio" bind:group={effect} value="holographic" />
				</label>

				<!-- Mirror -->
				<label class="h-12 rounded-full border-light p-0.5" class:border-2={effect === 'mirror'}>
					<div class="flex size-full items-center justify-center rounded-full bg-light/10">
						Mirror
					</div>
					<input class="hidden" type="radio" bind:group={effect} value="mirror" />
				</label>
			</div>
		</div>
	</main>

	<footer
		class="sticky bottom-0 z-50 flex w-full items-center justify-center bg-linear-to-b from-transparent to-dark p-6"
	>
		<button
			onclick={handleApply}
			class="w-full rounded-full border border-light/10 bg-dark/70 p-4 font-semibold backdrop-blur"
		>
			Aplicar cambios
		</button>
	</footer>
</Modal>
