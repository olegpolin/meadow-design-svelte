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

<div
	bind:this={ref}
	data-slot="attachment-actions"
	class={cn(
		// Over an image the actions sit on small paper chips so they stay legible.
		"relative z-20 flex shrink-0 items-center gap-0.5 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3.5 group-data-[orientation=vertical]/attachment:end-3.5 group-data-[orientation=vertical]/attachment:gap-1 group-data-[orientation=vertical]/attachment:*:data-[slot=attachment-action]:size-8 group-data-[orientation=vertical]/attachment:*:data-[slot=attachment-action]:border group-data-[orientation=vertical]/attachment:*:data-[slot=attachment-action]:bg-background group-data-[orientation=vertical]/attachment:*:data-[slot=attachment-action]:text-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
