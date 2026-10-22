<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children: childrenProp,
		closeOnSelect = false,
		...restProps
	}: WithoutChild<ContextMenuPrimitive.RadioItemProps> & {
		inset?: boolean;
	} = $props();
</script>

<ContextMenuPrimitive.RadioItem
	bind:ref
	{closeOnSelect}
	data-slot="context-menu-radio-item"
	data-inset={inset}
	class={cn(
		"relative flex h-10 cursor-default items-center gap-2.5 rounded-md text-[0.9375rem] outline-hidden select-none data-highlighted:bg-current/10 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 pr-3 pl-9",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span
			class="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
			{#if checked}
				<CheckIcon class="stroke-[2.5]" />
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</ContextMenuPrimitive.RadioItem>
