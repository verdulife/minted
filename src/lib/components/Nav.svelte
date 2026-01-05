<script>
	import HomeIcon from '@/lib/assets/HomeIcon.svelte';
	import CreateIcon from '@/lib/assets/CreateIcon.svelte';
	import CollectionIcon from '@/lib/assets/CollectionIcon.svelte';
	import UserIcon from '@/lib/assets/UserIcon.svelte';
	import { page } from '$app/stores';

	$: activeRoute = $page.url.pathname;
</script>

<footer class="fixed right-0 bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white">
	<nav>
		<ul class="mx-auto grid max-w-64 grid-cols-4 gap-12">
			<li>
				<a
					href="/"
					class="flex items-center justify-center py-6 opacity-50"
					class:opacity-100={activeRoute === '/'}
					title="Inicio"
				>
					<HomeIcon class="size-6" />
				</a>
			</li>

			<li>
				<a
					href="/create"
					class="flex items-center justify-center py-6 opacity-50"
					class:opacity-100={activeRoute === '/create'}
					title="Crear"
				>
					<CreateIcon class="size-6" />
				</a>
			</li>

			<li>
				<a
					href="/collection"
					class="flex items-center justify-center py-6 opacity-50"
					class:opacity-100={activeRoute === '/collection'}
					title="Colección"
				>
					<CollectionIcon class="size-6" />
				</a>
			</li>

			<li>
				<a
					href="/settings"
					class="flex items-center justify-center py-6 opacity-50"
					class:opacity-100={activeRoute === '/settings'}
					title="Ajustes"
				>
					<UserIcon class="size-6" />
				</a>
			</li>
		</ul>
	</nav>
</footer>
