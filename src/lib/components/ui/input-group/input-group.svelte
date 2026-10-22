<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...props
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="input-group"
	role="group"
	class={cn(
		/* One pill holding the control and its addons; the ring goes round the whole pill. */
		"group/input-group relative flex h-12 w-full min-w-0 items-center rounded-full border border-hairline bg-transparent text-[0.9375rem] outline-none transition-[border-color,box-shadow,opacity] duration-150",
		"has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/60 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background",
		"has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/25 has-[[data-slot=input-group-control]:disabled]:opacity-50",
		"in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0",
		/* Textareas and stacked addons turn the pill into a 20px card. */
		"has-[>textarea]:h-auto has-[>textarea]:rounded-lg has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:rounded-lg has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:rounded-lg",
		"has-[>[data-align=block-end]]:[&>input]:pt-3.5 has-[>[data-align=block-start]]:[&>input]:pb-3.5 has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=inline-start]]:[&>input]:pl-2",
		className
	)}
	{...props}
>
	{@render children?.()}
</div>
