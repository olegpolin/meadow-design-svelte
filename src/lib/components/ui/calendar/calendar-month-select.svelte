<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		onchange,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.MonthSelectProps> = $props();
</script>

<!-- A native select laid invisibly over a hairline pill, so the OS picker still opens. -->
<span
	class={cn(
		"relative flex rounded-full border border-hairline transition-[background-color] duration-150 hover:bg-current/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/60",
		className
	)}
>
	<CalendarPrimitive.MonthSelect
		bind:ref
		class="absolute inset-0 cursor-pointer bg-popover text-popover-foreground opacity-0"
		{...restProps}
	>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<select {...props} {value} {onchange}>
				{#each monthItems as monthItem (monthItem.value)}
					<option
						value={monthItem.value}
						selected={value !== undefined
							? monthItem.value === value
							: monthItem.value === selectedMonthItem.value}
					>
						{monthItem.label}
					</option>
				{/each}
			</select>
			<span
				class="flex h-[2.375rem] items-center gap-1 ps-3.5 pe-2.5 font-display text-sm font-bold tracking-normal select-none [&>svg]:size-3.5 [&>svg]:opacity-70"
				aria-hidden="true"
			>
				{monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
				<ChevronDownIcon />
			</span>
		{/snippet}
	</CalendarPrimitive.MonthSelect>
</span>
