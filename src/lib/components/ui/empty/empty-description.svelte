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
	data-slot="empty-description"
	class={cn(
		"text-base leading-normal text-muted-foreground [&>a]:font-bold [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-4 [&>a:hover]:opacity-80",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
