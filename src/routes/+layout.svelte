<script lang="ts">
	import '@/routes/layout.css';
	import { meta } from '@/lib/metadata';
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

<svelte:head>
	<title>{meta.title}</title>
	<link rel="canonical" href={meta.url} />
	<meta name="apple-mobile-web-app-title" content={meta.name} />
	<meta name="description" content={meta.description} />
	<meta property="og:url" content={meta.url} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:image" content={meta.image} />
	<meta property="og:description" content={meta.description} />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content={meta.image} />
	<meta name="twitter:image:alt" content={meta.title} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": meta.name,
			"url": meta.url
		}
	</script>
</svelte:head>

{#if $isInitialized}
	{@render children()}
{:else}
	<div class="flex h-screen items-center justify-center bg-black text-white">
		<Logo class="w-24 animate-pulse" />
	</div>
{/if}

<Background />
