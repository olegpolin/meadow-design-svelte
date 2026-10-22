<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn("border-b transition-[background-color] duration-150 hover:bg-muted/60 has-aria-expanded:bg-muted/60 data-[state=selected]:bg-secondary/50", className)}
	{...restProps}
>
	{@render children?.()}
</tr>
