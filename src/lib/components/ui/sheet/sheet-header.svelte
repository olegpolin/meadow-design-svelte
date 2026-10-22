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
	data-slot="sheet-header"
	class={cn("flex flex-col gap-2 p-6 md:p-8 group-data-close-button/sheet-content:pr-16 md:group-data-close-button/sheet-content:pr-20", className)}
	{...restProps}
>
	{@render children?.()}
</div>
