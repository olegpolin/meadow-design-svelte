<script lang="ts" module>
	export type TraceLineStatus = "running" | "error" | "pending";
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		status,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		status?: TraceLineStatus;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="trace-line"
	data-status={status}
	class={cn(
		// Lines follow the text colour, so a trace reads on paper, both colour
		// blocks and the ink card. Status shows in the icon and the words; error
		// also takes the destructive colour, pending is faded.
		"flex w-fit max-w-full min-w-0 items-center gap-2.5 py-1 text-[0.9375rem] transition-opacity duration-150 in-[a,button]:cursor-pointer in-[a:hover,button:hover]:opacity-75 data-[status=error]:text-destructive data-[status=pending]:opacity-55 data-[status=running]:*:data-[slot=trace-title]:shimmer",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
