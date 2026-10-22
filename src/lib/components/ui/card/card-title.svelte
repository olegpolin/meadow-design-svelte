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
	data-slot="card-title"
	class={cn(
		"font-display text-xl leading-tight font-extrabold tracking-[-0.02em] text-balance group-data-[size=sm]/card:text-lg",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
