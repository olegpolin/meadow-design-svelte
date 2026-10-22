<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		child,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const mergedProps = $derived({
		...restProps,
		class: cn(
			"flex items-center gap-2 rounded-full border-2 border-current bg-current/10 px-5 font-display text-sm font-bold whitespace-nowrap tabular-nums group-data-[orientation=horizontal]/button-group:not-first:border-l group-data-[orientation=vertical]/button-group:not-first:border-t [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
			className
		),
		"data-slot": "button-group-text",
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render mergedProps.children?.()}
	</div>
{/if}
