<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		onClick?: () => void;
	}

	const { onClick }: Props = $props();

	function handleClick() {
		if (onClick) onClick();
		goto('/');
	}
</script>

<button
	class="fixed top-6 right-6 z-40 grid size-10 place-content-center rounded-full border border-light/10 bg-light/5 backdrop-blur"
	onclick={handleClick}
>
	✕
</button>
