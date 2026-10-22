<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.DayProps = $props();
</script>

<!--
	A 40px circle. Hover and today follow the current text colour, so the grid
	reads on paper and on both colour blocks; the selected day is ink.
-->
<CalendarPrimitive.Day
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
		// Selected
		"data-selected:border-transparent data-selected:bg-primary data-selected:font-semibold data-selected:text-primary-foreground data-selected:opacity-100 data-selected:hover:bg-primary/90",
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
