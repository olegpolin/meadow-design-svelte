<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		orientation = "horizontal",
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.

A 4px track at 20% of the current colour, a solid range and a 20px thumb in
the current colour with a ring of the page colour, so it reads on every surface.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	{orientation}
	class={cn(
		"relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-horizontal:h-5 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-5 data-vertical:flex-col",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbItems })}
		<span
			data-slot="slider-track"
			data-orientation={orientation}
			class="relative grow overflow-hidden rounded-full bg-current/20 data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
		>
			<SliderPrimitive.Range
				data-slot="slider-range"
				class="absolute bg-current select-none data-horizontal:h-full data-vertical:w-full"
			/>
		</span>
		{#each thumbItems as thumb (thumb.index)}
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				index={thumb.index}
				class="relative block size-5 shrink-0 cursor-grab rounded-full border-[3px] border-background bg-current outline-none transition-[box-shadow] duration-150 select-none after:absolute after:-inset-2.5 hover:ring-4 hover:ring-current/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing data-disabled:pointer-events-none"
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
