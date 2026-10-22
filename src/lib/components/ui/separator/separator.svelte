<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		"data-slot": dataSlot = "separator",
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<!-- The ink hairline. It takes the text colour, so it inverts on the ink card. -->
<SeparatorPrimitive.Root
	bind:ref
	data-slot={dataSlot}
	class={cn(
		"shrink-0 bg-current data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
		className
	)}
	{...restProps}
/>
