<script lang="ts">
	import { cn } from '#lib/utils.js';

	let { class: className, label = 'Meadow' }: { class?: string; label?: string } = $props();
</script>

<!--
	The mark: four blades of grass as a small rounded cluster, drawn with the
	current text colour so it inverts with the surface. Decorative; the word
	beside it carries the name.
-->
<span class={cn('inline-flex items-center gap-2.5', className)}>
	<svg viewBox="0 0 32 32" class="size-7 shrink-0" aria-hidden="true" fill="none">
		<path
			d="M16 29c0-8 1-15 6-22M16 29c0-6-2-12-7-16M16 29c0-9 3-13 10-15M16 29C15 21 11 16 4 15"
			stroke="currentColor"
			stroke-width="2.6"
			stroke-linecap="round"
		/>
	</svg>
	<span class="font-display text-xl leading-none font-extrabold tracking-[-0.03em]">{label}</span>
</span>
