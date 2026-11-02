<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="attachment-title"
	class={cn(
		"block max-w-full min-w-0 truncate font-display text-sm font-bold group-data-[size=xs]/attachment:text-xs",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
