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
	data-slot="alert-title"
	class={cn(
		"font-display text-lg leading-snug font-extrabold tracking-[-0.02em] group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:opacity-80",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
