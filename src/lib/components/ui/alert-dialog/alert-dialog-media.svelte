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
	data-slot="alert-dialog-media"
	class={cn("mb-2 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground sm:group-data-[size=default]/alert-dialog-content:row-span-2 sm:group-data-[size=default]/alert-dialog-content:mb-0 *:[svg:not([class*='size-'])]:size-6", className)}
	{...restProps}
>
	{@render children?.()}
</div>
