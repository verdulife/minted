<script lang="ts">
	import { db, type Mint } from '$lib/db';
	import { onMount, onDestroy } from 'svelte';
	import { liveQuery } from 'dexie';
	import { canDelete } from '$lib/logic';
	import { page } from '$app/stores';
	import CollectionGrid from '$lib/components/ui/CollectionGrid.svelte';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import ShareQRModal from '@/lib/components/ui/ShareQRModal.svelte';
	import TrashIcon from '@/lib/assets/TrashIcon.svelte';
	import Nav from '@/lib/components/Nav.svelte';
	import Back from '@/lib/components/Back.svelte';

	// Queries reactivas usando Dexie liveQuery
	let myMints = liveQuery(() => db.table('myMints').toArray());
	let collection = liveQuery(() => db.table('collection').toArray());

	let searchParams = $page.url.searchParams;
	let mintId = searchParams.get('id');
	let mintPromise = mintId ? db.table('collection').where('id').equals(mintId).first() : null;

	let activeTab = $state<'mine' | 'received'>('mine');
	let selectedMint = $state<Mint | null>();
	let showShareModal = $state(false);

	// Estado para mantener los filtros de caducidad actualizados
	let now = $state(Date.now());
	let timer: ReturnType<typeof setInterval>;

	onMount(() => {
		timer = setInterval(() => (now = Date.now()), 30 * 1000); // Actualizar cada 30s
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	// --- FILTROS ---
	let filteredMints = $derived(() => {
		if (activeTab === 'mine') return $myMints || [];
		else return $collection || [];
	});

	function handleMintClick(mint: Mint) {
		selectedMint = mint;
	}

	function closeDetail() {
		selectedMint = null;
	}

	async function handleDelete() {
		if (!selectedMint) return;

		const context = activeTab === 'mine' ? 'issuer' : 'collection';

		if (!canDelete(selectedMint, context)) {
			alert('No puedes eliminar un compromiso activo hasta que caduque o se canjee.');
			return;
		}

		if (!window.confirm('¿Estás seguro de que quieres eliminar esta carta permanentemente?')) {
			return;
		}

		try {
			const table = activeTab === 'mine' ? 'myMints' : 'collection';
			await db.table(table).delete(selectedMint.id);
			closeDetail();
		} catch (e) {
			console.error('Error eliminando mint:', e);
			alert('Hubo un error al intentar eliminar la carta.');
		}
	}

	onMount(async () => {
		if (mintPromise) {
			selectedMint = await mintPromise;
		}
	});
</script>

<div>
	<!-- HEADER -->
	<header class="sticky top-0 z-30 p-6">
		<!-- TABS -->
		<div class="flex rounded-full border border-light/10 bg-dark/70 p-1 backdrop-blur">
			<button
				onclick={() => (activeTab = 'mine')}
				class="flex-1 rounded-full border-light/20 py-2 text-sm font-semibold"
				class:border={activeTab === 'mine'}
				class:text-neutral-400={activeTab !== 'mine'}
			>
				Mías ({($myMints || []).length})
			</button>
			<button
				onclick={() => (activeTab = 'received')}
				class="flex-1 rounded-full border-light/20 py-2 text-sm font-semibold"
				class:border={activeTab !== 'mine'}
				class:text-neutral-400={activeTab === 'mine'}
			>
				Recibidas ({($collection || []).length})
			</button>
		</div>
	</header>

	<main>
		<CollectionGrid cards={filteredMints()} {activeTab} onCardClick={handleMintClick} />
	</main>

	<!-- DETAIL MODAL (MODO 3D) -->
	{#if selectedMint}
		<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark">
			<Back onClick={closeDetail} />

			<div class="relative h-svh w-full overflow-clip">
				<Scene card={selectedMint} />

				<div class="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex flex-col p-6">
					<div class="pointer-events-auto flex gap-4">
						<button
							onclick={() => (showShareModal = true)}
							class="flex-1 rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold"
						>
							Compartir
						</button>

						<button
							onclick={handleDelete}
							class="rounded-full border border-light/10 bg-light/5 p-4 text-sm font-semibold text-red-700"
						>
							<TrashIcon class="size-6" />
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- SHARE MODAL -->
	{#if showShareModal && selectedMint}
		<ShareQRModal mint={selectedMint} onClose={() => (showShareModal = false)} />
	{/if}
</div>

<Nav />
