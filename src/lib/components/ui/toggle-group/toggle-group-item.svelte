<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { type ToggleVariants, toggleVariants } from "#lib/components/ui/toggle/index.js";
	import { cn } from "#lib/utils.js";
	import { getToggleGroupCtx } from "./toggle-group.svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size,
		variant,
		...restProps
	}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

	const ctx = getToggleGroupCtx();

	const resolvedVariant = $derived(ctx.variant || variant);
	const resolvedSize = $derived(ctx.size || size);
	const joined = $derived(ctx.spacing === 0);

	/*
	 * Joined groups (spacing 0) are one pill:
	 * - default: items sit in a tinted track 4px in, so they are 8px shorter
	 *   than a standalone toggle and the whole control matches the button height;
	 * - outline: items butt together like a button group, square inner corners,
	 *   pill ends and 1px dividers between segments.
	 */
	const trackSizes = {
		default: "h-10 min-w-10",
		sm: "h-8 min-w-8 px-2.5",
		lg: "h-12 min-w-12",
	} as const;
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	data-slot="toggle-group-item"
	data-variant={resolvedVariant}
	data-size={resolvedSize}
	data-spacing={ctx.spacing}
	class={cn(
		toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
		"focus:z-10 focus-visible:z-10",
		joined && "focus-visible:ring-offset-0",
		joined && resolvedVariant === "default" && trackSizes[resolvedSize ?? "default"],
		joined &&
			resolvedVariant === "outline" &&
			"rounded-none group-data-horizontal/toggle-group:not-first:border-l group-data-horizontal/toggle-group:not-last:border-r-0 group-data-horizontal/toggle-group:first:rounded-l-full group-data-horizontal/toggle-group:last:rounded-r-full group-data-vertical/toggle-group:not-first:border-t group-data-vertical/toggle-group:not-last:border-b-0 group-data-vertical/toggle-group:first:rounded-t-lg group-data-vertical/toggle-group:last:rounded-b-lg",
		className
	)}
	{value}
	{...restProps}
/>
