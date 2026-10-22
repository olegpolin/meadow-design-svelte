<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLTableAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> = $props();
</script>

<!--
	Meadow tables: no outer frame, ink hairlines between rows, tabular figures.
	Right-align numeric columns with `class="text-right"` on the head and cells.
-->
<div data-slot="table-container" class="relative w-full overflow-x-auto">
	<table
		bind:this={ref}
		data-slot="table"
		class={cn("w-full caption-bottom border-collapse text-[0.9375rem] tabular-nums", className)}
		{...restProps}
	>
		{@render children?.()}
	</table>
</div>
