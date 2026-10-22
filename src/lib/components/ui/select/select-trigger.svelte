<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: "sm" | "default";
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		/* Matches the input pill. */
		"flex w-fit items-center justify-between gap-2 rounded-full border border-hairline bg-transparent pr-4 pl-5 text-[0.9375rem] whitespace-nowrap outline-none transition-[border-color,box-shadow,background-color] duration-150 select-none hover:bg-current/5 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-current/55 data-[size=default]:h-12 data-[size=sm]:h-10 data-[size=sm]:pr-3.5 data-[size=sm]:pl-4 data-[size=sm]:text-sm",
		"*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="pointer-events-none size-4 text-current/70" />
</SelectPrimitive.Trigger>
