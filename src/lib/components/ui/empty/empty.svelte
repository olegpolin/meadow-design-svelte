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

<!-- No frame by default: the empty state sits on whatever surface holds it. Add `border rounded-lg` for a framed one. -->
<div
	bind:this={ref}
	data-slot="empty"
	class={cn(
		"flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-hairline p-6 text-center text-balance md:p-10",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
