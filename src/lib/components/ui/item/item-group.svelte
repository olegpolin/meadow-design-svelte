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

<!-- Hairlines between rows, in the text colour so they hold on the colour blocks and the ink card. -->
<div
	bind:this={ref}
	role="list"
	data-slot="item-group"
	class={cn(
		"group/item-group flex w-full flex-col divide-y divide-hairline *:data-[slot=item-separator]:hidden",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
