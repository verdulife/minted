<script lang="ts">
	let { onImageSelected }: { onImageSelected: (base64: string) => void } = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleFile(file: File) {
		if (!file || !file.type.startsWith('image/')) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			onImageSelected(result);
		};
		reader.readAsDataURL(file);
	}

	function onDrop(e: DragEvent) {
		isDragging = false;
		e.preventDefault();
		if (e.dataTransfer?.files?.[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	}

	function onFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files?.[0]) {
			handleFile(target.files[0]);
		}
	}
</script>

<button
	class="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all
  {isDragging
		? 'border-purple-500 bg-purple-500/10'
		: 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'}"
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => (isDragging = false)}
	ondrop={onDrop}
	onclick={() => fileInput.click()}
>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={onFileChange}
	/>

	<div class="flex flex-col items-center space-y-2 text-center text-gray-400">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-10 w-10 text-gray-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		</svg>
		<p class="text-sm font-medium">Click o arrastra tu imagen aquí</p>
		<p class="text-xs text-gray-500">JPG, PNG, WebP (Max 2MB)</p>
	</div>
</button>
