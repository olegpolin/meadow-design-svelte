<script lang="ts">
	import { setTheme, theme } from 'mode-watcher';
	import { Button } from '#lib/components/ui/button/index.js';
	import { DEFAULT_PALETTE, isPaletteId, type Palette } from '#lib/theme/palettes.js';
	import { paletteValues, type BrandRole } from './palette-values.js';

	/**
	 * One palette as five swatches in its own light colours, whatever palette
	 * and mode the page is in. `data-theme` on the list redeclares the brand
	 * variables there, so `bg-paper`, `bg-ink` etc. resolve to this palette
	 * (the dark values only apply on <html>, so the list always shows light).
	 */
	let { palette }: { palette: Palette } = $props();

	const roles: { role: BrandRole; name: string; swatch: string }[] = [
		{ role: 'paper', name: 'Paper', swatch: 'bg-paper' },
		{ role: 'block-a', name: 'Warm block', swatch: 'bg-block-a' },
		{ role: 'block-b', name: 'Cool block', swatch: 'bg-block-b' },
		{ role: 'ink', name: 'Ink', swatch: 'bg-ink' },
		{ role: 'ink-soft', name: 'Soft ink', swatch: 'bg-(--ink-soft)' }
	];

	const values = $derived(paletteValues[palette.id].light);
	const current = $derived(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);
	const active = $derived(current === palette.id);
</script>

<div class="grid gap-5 border-b py-6 md:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] lg:gap-10">
	<div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 lg:flex-col lg:justify-start">
		<div>
			<h3 class="display-4">{palette.name}</h3>
			<p class="mt-1.5 max-w-[18rem] text-sm leading-normal text-muted-foreground">{palette.description}</p>
		</div>
		{#if active}
			<p class="inline-flex h-10 items-center font-display text-sm font-bold">In use</p>
		{:else}
			<Button size="sm" variant="outline" onclick={() => setTheme(palette.id)}>Use {palette.name}</Button>
		{/if}
	</div>

	<ul
		class="grid gap-3 sm:grid-cols-5 sm:gap-4"
		aria-label="{palette.name} colours"
		data-theme={palette.id}
	>
		{#each roles as { role, name, swatch } (role)}
			<li class="flex min-w-0 items-center gap-4 sm:flex-col sm:items-stretch sm:gap-3">
				<span class="size-14 shrink-0 rounded-md border border-ink/25 sm:h-24 sm:w-full md:h-28 {swatch}"></span>
				<span class="flex min-w-0 flex-col gap-0.5">
					<span class="font-display text-sm font-bold">{name}</span>
					<code class="text-xs text-muted-foreground">--{role}</code>
					<code class="text-xs break-words text-muted-foreground tabular-nums">{values[role]}</code>
				</span>
			</li>
		{/each}
	</ul>
</div>
