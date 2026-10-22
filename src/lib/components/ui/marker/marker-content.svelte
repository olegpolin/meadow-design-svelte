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
	data-slot="marker-content"
	class={cn(
		"min-w-0 wrap-break-word *:[a]:underline *:[a]:decoration-1 *:[a]:underline-offset-3 *:[a]:hover:opacity-75 group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:rounded-full group-data-[variant=separator]/marker:bg-accent group-data-[variant=separator]/marker:px-3 group-data-[variant=separator]/marker:py-1 group-data-[variant=separator]/marker:text-center group-data-[variant=separator]/marker:font-display group-data-[variant=separator]/marker:font-bold group-data-[variant=separator]/marker:text-accent-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
