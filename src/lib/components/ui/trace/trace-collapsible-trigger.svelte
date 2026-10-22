<script lang="ts">
	import * as Collapsible from "#lib/components/ui/collapsible/index.js";
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { cn, type WithoutChild } from "#lib/utils.js";
	import TraceIcon from "./trace-icon.svelte";
	import type { Collapsible as CollapsiblePrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.TriggerProps> = $props();
</script>

<Collapsible.Trigger
	bind:ref
	data-slot="trace-collapsible-trigger"
	class={cn(
		"group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-xs text-left outline-none transition-opacity duration-150 hover:opacity-75 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background has-[[data-status=error]]:text-destructive",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<TraceIcon class="transition-transform duration-150 group-aria-expanded/trace-collapsible-trigger:rotate-90 rtl:rotate-180 rtl:group-aria-expanded/trace-collapsible-trigger:rotate-90">
		<ChevronRightIcon  />
	</TraceIcon>
</Collapsible.Trigger>
