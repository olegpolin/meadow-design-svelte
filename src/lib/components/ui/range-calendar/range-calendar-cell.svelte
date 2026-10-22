<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: RangeCalendarPrimitive.CellProps = $props();
</script>

<!--
	The cell draws the range band on ::before so the day circle stays round on
	top of it: full width between the ends, half width under each end, rounded
	where the band meets the edge of a week.
-->
<RangeCalendarPrimitive.Cell
	bind:ref
	class={cn(
		"relative size-(--cell-size) p-0 text-center focus-within:z-20",
		"before:pointer-events-none before:absolute before:inset-0 before:hidden before:bg-accent",
		"data-range-middle:before:block data-highlighted:not-data-selected:before:block",
		"data-range-start:not-data-range-end:before:block data-range-start:not-data-range-end:before:left-1/2",
		"data-range-end:not-data-range-start:before:block data-range-end:not-data-range-start:before:right-1/2",
		"first:data-range-middle:before:rounded-s-full last:data-range-middle:before:rounded-e-full",
		"first:data-highlighted:before:rounded-s-full last:data-highlighted:before:rounded-e-full",
		"first:data-range-end:before:rounded-s-full last:data-range-start:before:rounded-e-full",
		className
	)}
	{...restProps}
/>
