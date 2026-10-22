<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="trace"
	class={cn(
		// A list of steps. Rows wrapped in a link or button get the shared focus ring.
		"flex w-full min-w-0 flex-col gap-1 *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:rounded-xs *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:outline-none *:has-[>[data-slot=trace-line]]:focus-visible:ring-3 *:has-[>[data-slot=trace-line]]:focus-visible:ring-ring/60 *:has-[>[data-slot=trace-line]]:focus-visible:ring-offset-2 *:has-[>[data-slot=trace-line]]:focus-visible:ring-offset-background",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
