<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * A full-width section of the styles page: the same hairline and padding as
	 * the catalog `Section`, with the title above the content instead of beside
	 * it, for blocks that need the whole width (palettes, surfaces, type).
	 */
	let {
		id,
		title,
		description,
		class: className,
		children
	}: {
		id: string;
		title: string;
		description?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<section {id} class={cn('scroll-mt-24 border-t py-8 md:py-12', className)} aria-labelledby="{id}-title">
	<div class="grid gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] md:gap-10">
		<h2 id="{id}-title" class="display-3">{title}</h2>
		{#if description}
			<p class="max-w-[38rem] text-sm leading-normal text-muted-foreground md:pt-1.5 md:text-[0.9375rem]">
				{description}
			</p>
		{/if}
	</div>
	<div class="mt-6 min-w-0 md:mt-10">
		{@render children()}
	</div>
</section>
