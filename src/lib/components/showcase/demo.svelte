<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * A preview surface. `tone` puts the demo on paper, on one of the two
	 * colour blocks, or on the ink card, so a component can be shown on every
	 * surface it will meet.
	 */
	let {
		label,
		tone = 'paper',
		layout = 'row',
		frame = true,
		class: className,
		children
	}: {
		/** Short caption above the preview, e.g. "Sizes". */
		label?: string;
		tone?: 'paper' | 'warm' | 'cool' | 'ink';
		/** `row`: wrapped flex row. `stack`: vertical. `block`: no flex, children control layout. */
		layout?: 'row' | 'stack' | 'block';
		/** On paper, drop the hairline frame and padding: for components that draw their own border (cards, alerts, framed lists). */
		frame?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	const tones = $derived({
		paper: frame ? 'border bg-background text-foreground' : 'bg-background text-foreground p-0 md:p-0',
		warm: 'bg-secondary text-secondary-foreground',
		cool: 'bg-accent text-accent-foreground',
		ink: 'bg-primary text-primary-foreground'
	});

	const layouts = {
		row: 'flex flex-wrap items-center gap-4',
		stack: 'flex flex-col gap-4',
		block: ''
	};
</script>

<figure class="flex min-w-0 flex-col gap-2">
	{#if label}
		<figcaption class="font-display text-[0.8125rem] font-bold">{label}</figcaption>
	{/if}
	<div class={cn('min-w-0 rounded-lg p-5 md:p-8', layouts[layout], tones[tone], className)}>
		{@render children()}
	</div>
</figure>
