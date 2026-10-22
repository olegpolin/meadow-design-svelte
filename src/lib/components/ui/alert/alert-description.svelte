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
	data-slot="alert-description"
	class={cn(
		"text-[0.9375rem] leading-normal text-pretty text-muted-foreground group-has-[>svg]/alert:col-start-2 [&_p:not(:last-child)]:mb-3 [&_a]:font-display [&_a]:font-bold [&_a]:text-current [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:opacity-80",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
