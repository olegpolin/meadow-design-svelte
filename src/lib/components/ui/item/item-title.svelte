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
	data-slot="item-title"
	class={cn(
		"flex w-fit items-center gap-2 font-display text-base leading-snug font-bold line-clamp-1 group-data-[size=sm]/item:text-[0.9375rem] group-data-[size=xs]/item:text-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
