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

<!-- Overlapping avatars, each cut out of the page with a paper ring. -->
<div
	bind:this={ref}
	data-slot="avatar-group"
	class={cn(
		"group/avatar-group flex -space-x-2.5 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background has-data-[size=lg]:-space-x-3.5 has-data-[size=sm]:-space-x-2",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
