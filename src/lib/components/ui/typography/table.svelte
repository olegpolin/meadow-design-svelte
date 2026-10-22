<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLTableAttributes } from "svelte/elements";
	import { typographyVariants } from "./variants.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> = $props();
</script>

<!--
	A plain table inside running text: write raw thead/tbody/tr/th/td inside it.
	Rows are ink hairlines; right-align numbers with `align="right"` on the cells.
	For data tables with sorting or selection use the Table component.
-->
<div data-slot="typography-table-container" class={typographyVariants.tableContainer}>
	<table bind:this={ref} data-slot="typography-table" class={cn(typographyVariants.table, className)} {...restProps}>
		{@render children?.()}
	</table>
</div>
