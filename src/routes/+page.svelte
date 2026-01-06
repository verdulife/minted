<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db, type Mint } from '$lib/db';
	import { liveQuery } from 'dexie';
	import CollectionGrid from '$lib/components/ui/CollectionGrid.svelte';
	import Scene from '@/lib/components/3d/Scene.svelte';
	import ShareQRModal from '@/lib/components/ui/ShareQRModal.svelte';
	import { isExpired, canDelete } from '$lib/logic';
	import TrashIcon from '@/lib/assets/TrashIcon.svelte';

	// Queries reactivas usando Dexie liveQuery
	let myMints = liveQuery(() => db.table('myMints').toArray());
	let collection = liveQuery(() => db.table('collection').toArray());

	let activeTab = $state<'mine' | 'received'>('mine');
	let subTab = $state<'active' | 'inactive'>('active');
	let selectedMint = $state<Mint | null>(null);
	let showShareModal = $state(false);

	// Estado para mantener los filtros de caducidad actualizados
	let now = $state(Date.now());
	let timer: ReturnType<typeof setInterval>;

	onMount(() => {
		timer = setInterval(() => (now = Date.now()), 30000); // Actualizar cada 30s
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	// --- FILTROS ---
	let filteredMints = $derived(() => {
		// Mock de dependencia de 'now' para forzar reactividad si fuera necesario
		// aunque isExpired(m.expiresAt) ya comparará con el Date.now() actual
		// pero tener 'now' como dependencia reactiva es más robusto en Svelte 5.
		const _currentNow = now;

		if (activeTab === 'mine') {
			const source = $myMints || [];
			if (subTab === 'active') {
				return source.filter((m) => m.status === 'active' && !isExpired(m.expiresAt));
			} else {
				return source.filter((m) => m.status === 'redeemed' || isExpired(m.expiresAt));
			}
		} else {
			const source = $collection || [];
			if (subTab === 'active') {
				return source.filter((m) => m.status === 'active' && !isExpired(m.expiresAt));
			} else {
				return source.filter((m) => m.status === 'used' || isExpired(m.expiresAt));
			}
		}
	});

	// Etiquetas dinámicas para las sub-tabs
	let subTabLabels = $derived(() => {
		if (activeTab === 'mine') {
			return { active: 'Vigentes', inactive: 'Finalizadas' };
		}
		return { active: 'Disponibles', inactive: 'Usadas' };
	});

	let subTabActive = $derived(subTabLabels().active);

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
</script>

<div class="min-h-dvh">
	<!-- HEADER -->
	<header class="sticky top-0 z-30 border-b border-light/10 bg-dark p-6">
		<!-- TABS -->
		<div class="flex rounded-full bg-light/5 p-1 ring-1 ring-light/10">
			<button
				onclick={() => (activeTab = 'mine')}
				class="flex-1 rounded-full py-2 text-sm font-semibold transition-all"
				class:bg-light={activeTab === 'mine'}
				class:text-dark={activeTab === 'mine'}
				class:text-neutral-400={activeTab !== 'mine'}
			>
				Mías ({($myMints || []).length})
			</button>
			<button
				onclick={() => {
					activeTab = 'received';
					subTab = 'active';
				}}
				class="flex-1 rounded-full py-2 text-sm font-semibold transition-all"
				class:bg-light={activeTab === 'received'}
				class:text-dark={activeTab === 'received'}
				class:text-neutral-400={activeTab !== 'received'}
			>
				Recibidas ({($collection || []).length})
			</button>
		</div>

		<!-- SUB-TABS -->
		<div class="mt-6 flex justify-center gap-16">
			<button
				onclick={() => (subTab = 'active')}
				class="text-xs font-bold tracking-wider uppercase transition-all"
				class:text-light={subTab === 'active'}
				class:text-neutral-500={subTab !== 'active'}
			>
				{subTabLabels().active}
			</button>
			<button
				onclick={() => (subTab = 'inactive')}
				class="text-xs font-bold tracking-wider uppercase transition-all"
				class:text-light={subTab === 'inactive'}
				class:text-neutral-500={subTab !== 'inactive'}
			>
				{subTabLabels().inactive}
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-6xl pb-24">
		<!-- GRID -->
		<CollectionGrid
			cards={filteredMints()}
			{activeTab}
			{subTabActive}
			onCardClick={handleMintClick}
		/>
	</main>

	<!-- DETAIL MODAL (MODO 3D) -->
	{#if selectedMint}
		<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark">
			<button
				onclick={closeDetail}
				class="absolute top-6 left-6 z-10 h-10 w-10 rounded-full bg-white/10 transition-all hover:bg-white/20"
			>
				✕
			</button>

			<div class="relative h-svh overflow-clip">
				<Scene card={selectedMint} />

				<div class="pointer-events-none absolute right-0 bottom-17 left-0 z-20 flex flex-col p-6">
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
