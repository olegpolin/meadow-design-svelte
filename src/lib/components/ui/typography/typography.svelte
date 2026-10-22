<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { typographyVariants } from "./variants.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!-- A block of running text. Children set their own top margins; the first one has none. -->
<div bind:this={ref} data-slot="typography" class={cn(typographyVariants.root, className)} {...restProps}>
	{@render children?.()}
</div>
