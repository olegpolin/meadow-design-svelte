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

<!-- Add `border-t` for a hairline above the footer; it takes the card's text colour. -->
<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn(
		"flex items-center gap-3 border-hairline px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
