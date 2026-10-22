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
	data-slot="empty-title"
	class={cn(
		"font-display text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] text-balance md:text-[1.625rem]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
