<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();
</script>

<!--
	Default: a pill inside the muted group; the active one is paper with an ink
	hairline. Line: no fill, a 2px underline in the current colour. State changes
	are instant (tabs are keyboard-driven); only hover colour is eased.
-->
<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		"relative inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap font-display text-[0.9375rem] font-bold outline-none select-none transition-[color,opacity] duration-150 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		// default: pill group
		"group-data-[variant=default]/tabs-list:rounded-full group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-4 group-data-[variant=default]/tabs-list:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:border-border group-data-[variant=default]/tabs-list:data-active:bg-background group-data-[variant=default]/tabs-list:data-active:text-foreground",
		// line: underline in the current colour
		"group-data-[variant=line]/tabs-list:rounded-md group-data-[variant=line]/tabs-list:px-3 group-data-[variant=line]/tabs-list:opacity-70 group-data-[variant=line]/tabs-list:hover:opacity-100 group-data-[variant=line]/tabs-list:data-active:opacity-100",
		"after:absolute after:bg-current after:opacity-0 group-data-horizontal/tabs:after:inset-x-3 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-2 group-data-vertical/tabs:after:left-0 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
		className
	)}
	{...restProps}
/>
