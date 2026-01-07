<script lang="ts">
	import '@/routes/layout.css';

	import { initAuth } from '@/lib/auth';
	import { isInitialized } from '@/lib/stores';
	import { onMount } from 'svelte';
	import Logo from '@/lib/assets/Logo.svelte';
	import Background from '@/lib/components/Background.svelte';

	let { children } = $props();

	onMount(() => {
		initAuth();
	});
</script>

{#if $isInitialized}
	{@render children()}
{:else}
	<div class="flex h-screen items-center justify-center bg-black text-white">
		<Logo class="w-24 animate-pulse" />
	</div>
{/if}

<Background />
