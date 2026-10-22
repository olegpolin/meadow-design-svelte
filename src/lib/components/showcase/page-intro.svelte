<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * The warm opening band every page starts with. It continues the header's
	 * band, so the two read as one block.
	 */
	let {
		title,
		lead,
		size = 'default',
		class: className,
		children
	}: {
		title: string;
		lead?: string;
		size?: 'default' | 'large';
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<section class={cn('bg-secondary text-secondary-foreground', className)}>
	<div class="wrap pt-4 pb-10 md:pt-10 md:pb-16">
		<h1 class={size === 'large' ? 'display-1' : 'display-2'}>{title}</h1>
		{#if lead}
			<p class="lead mt-4 max-w-[34rem] md:mt-6">{lead}</p>
		{/if}
		{@render children?.()}
	</div>
</section>
