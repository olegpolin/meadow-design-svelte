<script lang="ts">
	import { type WithElementRef } from "bits-ui";
	import { cn } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		inset,
		children,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="menubar-label"
	data-inset={inset}
	class={cn("px-3 pt-2 pb-1 font-display text-xs font-bold text-muted-foreground data-inset:pl-9", className)}
	{...restProps}
>
	{@render children?.()}
</div>
