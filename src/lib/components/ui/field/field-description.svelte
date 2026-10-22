<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
	bind:this={ref}
	data-slot="field-description"
	class={cn(
		"text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-2",
		"last:mt-0 nth-last-2:-mt-0.5",
		"[&>a]:font-medium [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-4 [&>a:hover]:opacity-80",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
