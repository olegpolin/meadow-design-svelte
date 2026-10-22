<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: RangeCalendarPrimitive.DayProps = $props();
</script>

<!--
	A 40px circle. The two ends of a range are ink; the days between sit on the
	cool band drawn by the cell behind them.
-->
<RangeCalendarPrimitive.Day
	bind:ref
	class={cn(
		"relative flex size-(--cell-size) flex-col items-center justify-center gap-0.5 rounded-full border border-transparent p-0 text-[0.9375rem] leading-none whitespace-nowrap tabular-nums outline-none select-none",
		"transition-[background-color,color,border-color,opacity] duration-150",
		"hover:bg-current/10",
		"focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-0",
		// Today: a hairline ring
		"data-today:border-hairline",
		// Outside months
		"data-outside-month:opacity-50",
		// Between the ends
		"data-highlighted:text-accent-foreground data-range-middle:text-accent-foreground data-selected:opacity-100",
		// Range ends
		"data-range-start:border-transparent data-range-start:bg-primary data-range-start:font-semibold data-range-start:text-primary-foreground data-range-start:hover:bg-primary/90",
		"data-range-end:border-transparent data-range-end:bg-primary data-range-end:font-semibold data-range-end:text-primary-foreground data-range-end:hover:bg-primary/90",
		// Disabled
		"data-disabled:pointer-events-none data-disabled:opacity-40",
		// Unavailable
		"data-unavailable:line-through data-unavailable:opacity-50",
		// Inner spans (custom day content)
		"[&>span]:text-[0.625rem] [&>span]:opacity-70",
		className
	)}
	{...restProps}
/>
