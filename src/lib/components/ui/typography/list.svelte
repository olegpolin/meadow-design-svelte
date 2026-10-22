<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { typographyVariants } from "./variants.js";

	let {
		ref = $bindable(null),
		class: className,
		ordered = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement | HTMLOListElement>> & {
		/** Render an `<ol>` with numbers instead of a `<ul>` with bullets. */
		ordered?: boolean;
	} = $props();
</script>

<svelte:element
	this={ordered ? "ol" : "ul"}
	bind:this={ref}
	data-slot="typography-list"
	class={cn(typographyVariants.list, ordered ? "list-decimal" : "list-disc", className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
