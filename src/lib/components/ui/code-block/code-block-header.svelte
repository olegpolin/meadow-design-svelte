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
	data-slot="code-block-header"
	class={cn(
		"flex min-h-12 min-w-0 shrink-0 items-center gap-2 border-b py-1 ps-4 pe-1.5 text-muted-foreground group-data-[variant=destructive]/code-block:border-destructive group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:min-h-10 group-data-[size=sm]/code-block:ps-3 group-data-[size=sm]/code-block:pe-1 *:has-[>[data-slot=code-block-title]]:min-w-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
