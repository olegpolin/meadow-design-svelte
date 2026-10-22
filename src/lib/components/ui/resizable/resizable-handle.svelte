<script lang="ts">
	import * as ResizablePrimitive from "paneforge";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		withHandle = false,
		...restProps
	}: WithoutChildrenOrChild<ResizablePrimitive.PaneResizerProps> & {
		withHandle?: boolean;
	} = $props();
</script>

<!--
	A 1px hairline in the text colour with a wider invisible hit area (::after)
	that tints on hover and while dragging. `withHandle` adds a small pill grip.
-->
<ResizablePrimitive.PaneResizer
	bind:ref
	data-slot="resizable-handle"
	class={cn(
		"relative flex w-px items-center justify-center bg-current outline-none",
		"after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 after:rounded-full after:transition-[background-color,box-shadow] after:duration-150 hover:after:bg-current/10 data-[active=pointer]:after:bg-current/15",
		"focus-visible:after:bg-current/10 focus-visible:after:ring-3 focus-visible:after:ring-ring/60",
		"data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-3 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:translate-x-0 data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:inset-y-auto data-[direction=vertical]:after:top-1/2",
		"[&[data-direction=vertical]>div]:rotate-90",
		className
	)}
	{...restProps}
>
	{#if withHandle}
		<div aria-hidden="true" class="z-10 flex h-8 w-1.5 shrink-0 rounded-full bg-current"></div>
	{/if}
</ResizablePrimitive.PaneResizer>
