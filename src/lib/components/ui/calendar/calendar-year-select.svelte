<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.YearSelectProps> = $props();
</script>

<!-- A native select laid invisibly over a hairline pill, so the OS picker still opens. -->
<span
	class={cn(
		"relative flex rounded-full border border-hairline transition-[background-color] duration-150 hover:bg-current/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/60",
		className
	)}
>
	<CalendarPrimitive.YearSelect
		bind:ref
		class="absolute inset-0 cursor-pointer bg-popover text-popover-foreground opacity-0"
		{...restProps}
	>
		{#snippet child({ props, yearItems, selectedYearItem })}
			<select {...props} {value}>
				{#each yearItems as yearItem (yearItem.value)}
					<option
						value={yearItem.value}
						selected={value !== undefined
							? yearItem.value === value
							: yearItem.value === selectedYearItem.value}
					>
						{yearItem.label}
					</option>
				{/each}
			</select>
			<span
				class="flex h-[2.375rem] items-center gap-1 ps-3.5 pe-2.5 font-display text-sm font-bold tracking-normal tabular-nums select-none [&>svg]:size-3.5 [&>svg]:opacity-70"
				aria-hidden="true"
			>
				{yearItems.find((item) => item.value === value)?.label || selectedYearItem.label}
				<ChevronDownIcon />
			</span>
		{/snippet}
	</CalendarPrimitive.YearSelect>
</span>
