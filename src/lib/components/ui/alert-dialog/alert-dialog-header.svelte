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
	data-slot="alert-dialog-header"
	class={cn("grid justify-items-start gap-2 text-left group-data-[size=sm]/alert-dialog-content:justify-items-center group-data-[size=sm]/alert-dialog-content:text-center sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-cols-[auto_1fr] sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:gap-x-5", className)}
	{...restProps}
>
	{@render children?.()}
</div>
