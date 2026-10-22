<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();
</script>

<tfoot
	bind:this={ref}
	data-slot="table-footer"
	class={cn("border-t font-display font-bold [&>tr]:border-b-0 [&>tr]:hover:bg-transparent", className)}
	{...restProps}
>
	{@render children?.()}
</tfoot>
