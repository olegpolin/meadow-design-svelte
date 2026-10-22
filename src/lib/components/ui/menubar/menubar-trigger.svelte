<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	data-slot="menubar-trigger"
	class={cn(
		"flex h-10 items-center rounded-full px-4 font-display text-[0.9375rem] font-bold outline-none select-none transition-[background-color,color] duration-150 hover:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-0 data-open:bg-current/10 data-disabled:pointer-events-none data-disabled:opacity-50",
		className
	)}
	{...restProps}
/>
