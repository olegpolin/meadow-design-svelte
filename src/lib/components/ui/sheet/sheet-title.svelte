<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	data-slot="sheet-title"
	class={cn("font-display text-2xl leading-tight font-extrabold tracking-[-0.03em] text-balance", className)}
	{...restProps}
/>
