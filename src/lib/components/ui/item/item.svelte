<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	/*
	 * A row. In an ItemGroup the rows are split by hairlines in the text colour.
	 * When the row is a link or a button it gets a rounded tint on hover and a
	 * rounded focus ring, both drawn on an inset ::before layer so the hairlines
	 * between rows stay straight.
	 */
	export const itemVariants = tv({
		base: [
			"group/item relative isolate flex w-full flex-wrap items-center text-left outline-none",
			"before:pointer-events-none before:absolute before:inset-x-0 before:inset-y-1 before:-z-10 before:rounded-md before:transition-[background-color,box-shadow] before:duration-150",
			"[&:is(a,button)]:hover:before:bg-current/8 focus-visible:before:ring-3 focus-visible:before:ring-ring/60",
			"aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50",
		],
		variants: {
			variant: {
				default: "",
				outline: "rounded-lg border border-hairline before:inset-0 before:rounded-[inherit]",
				muted: "rounded-lg bg-muted text-foreground before:inset-0 before:rounded-[inherit]",
			},
			size: {
				default: "gap-4 px-3 py-4",
				sm: "gap-3 px-3 py-3",
				xs: "gap-2.5 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
			},
		},
		compoundVariants: [
			{ variant: ["outline", "muted"], size: "default", class: "px-5" },
			{ variant: ["outline", "muted"], size: "sm", class: "px-4" },
		],
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ItemSize = VariantProps<typeof itemVariants>["size"];
	export type ItemVariant = VariantProps<typeof itemVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		child,
		variant,
		size,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		variant?: ItemVariant;
		size?: ItemSize;
	} = $props();

	const mergedProps = $derived({
		class: cn(itemVariants({ variant, size }), className),
		"data-slot": "item",
		"data-variant": variant ?? "default",
		"data-size": size ?? "default",
		...restProps,
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render mergedProps.children?.()}
	</div>
{/if}
