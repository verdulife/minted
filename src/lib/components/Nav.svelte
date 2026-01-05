<script>
	import HomeIcon from '@/lib/assets/HomeIcon.svelte';
	import CreateIcon from '@/lib/assets/CreateIcon.svelte';
	import CollectionIcon from '@/lib/assets/CollectionIcon.svelte';
	import UserIcon from '@/lib/assets/UserIcon.svelte';
	import { page } from '$app/stores';

	$: activeRoute = $page.url.pathname;
</script>

<footer class="fixed right-0 bottom-0 left-0 z-50 w-full border-t border-light/10 bg-dark">
	<nav>
		<ul class="flex justify-center gap-3">
			<li>
				<a
					href="/"
					class="flex flex-col items-center justify-end gap-2 px-5 py-3 opacity-50"
					class:opacity-100={activeRoute === '/'}
					title="Inicio"
				>
					<HomeIcon class="size-5" />
					<p class="text-xs">Inicio</p>
				</a>
			</li>

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
					<p class="text-xs">Obtener</p>
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
