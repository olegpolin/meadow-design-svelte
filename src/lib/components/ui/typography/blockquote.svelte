<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLBlockquoteAttributes } from "svelte/elements";
	import { typographyVariants } from "./variants.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLBlockquoteAttributes> = $props();
</script>

<blockquote bind:this={ref} data-slot="typography-blockquote" class={cn(typographyVariants.blockquote, className)} {...restProps}>
	{@render children?.()}
</blockquote>
