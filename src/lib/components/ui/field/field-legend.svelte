<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "legend",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: "legend" | "label";
	} = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn("mb-2 font-display data-[variant=label]:text-sm data-[variant=label]:font-bold data-[variant=legend]:text-lg data-[variant=legend]:leading-tight data-[variant=legend]:font-extrabold data-[variant=legend]:tracking-[-0.02em]", className)}
	{...restProps}
>
	{@render children?.()}
</legend>
