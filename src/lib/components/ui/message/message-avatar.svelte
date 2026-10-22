<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!-- Round, anchored to the last line. It lifts clear of the footer when there is one. -->
<div
	bind:this={ref}
	data-slot="message-avatar"
	class={cn(
		"flex w-fit min-w-10 shrink-0 items-center justify-center self-end overflow-hidden rounded-full group-has-data-[slot=message-footer]/message:-translate-y-7",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
