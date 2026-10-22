<script lang="ts">
	import { Separator } from "#lib/components/ui/separator/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		...restProps
	}: ComponentProps<typeof Separator> = $props();
</script>

<!-- A 1px rule in the group's text colour, for segments that have no border of their own. -->
<Separator
	bind:ref
	data-slot="button-group-separator"
	{orientation}
	class={cn(
		"relative self-stretch bg-current/30 data-horizontal:w-auto data-vertical:h-auto",
		className
	)}
	{...restProps}
/>
