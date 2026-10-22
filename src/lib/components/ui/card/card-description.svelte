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

<!-- Soft ink on paper and the tints; on the ink card the soft ink would vanish, so it fades the card's own text colour instead. -->
<p
	bind:this={ref}
	data-slot="card-description"
	class={cn(
		"text-[0.9375rem] leading-normal text-muted-foreground group-data-[size=sm]/card:text-sm group-data-[tone=ink]/card:text-primary-foreground/80",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
