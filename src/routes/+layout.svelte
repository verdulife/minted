<script lang="ts">
	import '@/routes/layout.css';

	import { initAuth } from '@/lib/auth';
	import { isInitialized } from '@/lib/stores';
	import { onMount } from 'svelte';
	import Nav from '@/lib/components/Nav.svelte';

	let { children } = $props();

	onMount(() => {
		initAuth();
	});
</script>

{#if $isInitialized}
	{@render children()}
	<Nav />
{:else}
	<div class="flex h-screen items-center justify-center bg-black text-white">
		<p class="animate-pulse">Despertando tu mazo...</p>
	</div>
{/if}
