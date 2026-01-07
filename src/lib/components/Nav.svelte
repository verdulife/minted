<script>
	import CreateIcon from '@/lib/assets/CreateIcon.svelte';
	import CollectionIcon from '@/lib/assets/CollectionIcon.svelte';
	import UserIcon from '@/lib/assets/UserIcon.svelte';
	import { page } from '$app/stores';

	$: activeRoute = $page.url.pathname;
</script>

<footer class="fixed right-0 bottom-6 left-0 z-20 w-full">
	<nav class="flex items-center justify-center">
		<ul
			class="flex justify-center gap-3 rounded-full border border-light/10 bg-dark/70 px-6 backdrop-blur"
		>
			<li>
				<a
					href="/create"
					class="flex flex-col items-center justify-end gap-2 px-5 py-3 opacity-50"
					class:opacity-100={activeRoute === '/create'}
					title="Crear"
				>
					<CreateIcon class="size-5" />
					<p class="text-xs">Crear</p>
				</a>
			</li>

			<li>
				<a
					href="/get"
					class="flex flex-col items-center justify-end gap-2 px-5 py-3 opacity-50"
					class:opacity-100={activeRoute === '/get'}
					title="Colección"
				>
					<CollectionIcon class="size-5" />
					<p class="text-xs">Escaner</p>
				</a>
			</li>

			<li>
				<a
					href="/settings"
					class="flex flex-col items-center justify-end gap-2 px-5 py-3 opacity-50"
					class:opacity-100={activeRoute === '/settings'}
					title="Ajustes"
				>
					<UserIcon class="size-5" />
					<p class="text-xs">Ajustes</p>
				</a>
			</li>
		</ul>
	</nav>
</footer>
