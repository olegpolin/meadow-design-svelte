<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * One component on a catalog page: a hairline-topped block with the name,
	 * one sentence on when to use it, and the demos.
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
	<div class="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] md:gap-10">
		<div class="md:sticky md:top-8 md:self-start">
			<h2 id="{id}-title" class="display-3">{title}</h2>
			{#if description}
				<p class="mt-2 max-w-[22rem] text-sm leading-normal text-muted-foreground md:text-[0.9375rem]">
					{description}
				</p>
			{/if}
		</div>
		<div class="flex min-w-0 flex-col gap-6">
			{@render children()}
		</div>
	</div>
</section>
