<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { typographyVariants } from "./variants.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<code bind:this={ref} data-slot="typography-inline-code" class={cn(typographyVariants.inlineCode, className)} {...restProps}>
	{@render children?.()}
</code>
