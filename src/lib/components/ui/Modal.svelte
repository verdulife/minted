<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	interface Props {
		children: () => any;
		closeModal: () => void;
	}

	let { children, closeModal } = $props();

	function handleClose(ev) {
		ev.stopImmediatePropagation();
		closeModal();
	}
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 z-100 flex items-center justify-center bg-dark/50 p-6 backdrop-blur-md"
>
	<div
		transition:scale={{ duration: 300, start: 0.95 }}
		class="relative max-h-[80svh] w-full max-w-sm overflow-x-clip overflow-y-auto rounded-3xl border border-light/10 bg-neutral-900 shadow-2xl scrollbar-none"
	>
		{@render children()}
	</div>
</div>
