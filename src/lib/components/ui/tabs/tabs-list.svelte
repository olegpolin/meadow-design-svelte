<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	/*
	 * `default` is a pill group on the muted paper; `line` is transparent and
	 * follows the current text colour, so it works on the colour blocks and the
	 * ink card.
	 */
	export const tabsListVariants = tv({
		base: "group/tabs-list inline-flex w-fit max-w-full items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
		variants: {
			variant: {
				default:
					"gap-1 rounded-full bg-muted p-1 text-muted-foreground group-data-vertical/tabs:rounded-lg",
				line: "gap-1 rounded-none bg-transparent text-current",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type TabsListVariant = VariantProps<typeof tabsListVariants>["variant"];
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		variant = "default",
		class: className,
		...restProps
	}: TabsPrimitive.ListProps & {
		variant?: TabsListVariant;
	} = $props();
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	data-variant={variant}
	class={cn(tabsListVariants({ variant }), className)}
	{...restProps}
/>
