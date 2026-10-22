<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const markerVariants = tv({
		/*
		 * A small mark in the cool tint. `default` is an inline pill for a status
		 * or a note; `separator` puts the pill between two hairlines; `border` is a
		 * plain row over a hairline. Links and buttons get an underline and the
		 * shared focus ring.
		 */
		base: "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-[0.8125rem] outline-none [a]:underline [a]:decoration-1 [a]:underline-offset-3 [a,button]:transition-[background-color,opacity] [a,button]:duration-150 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "w-fit rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground [a,button]:hover:bg-accent/75",
				separator: "text-xs before:me-1 before:h-px before:min-w-0 before:flex-1 before:bg-current after:ms-1 after:h-px after:min-w-0 after:flex-1 after:bg-current",
				border: "border-b border-hairline pb-2 text-current/75 [a,button]:hover:text-current",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type MarkerVariant = VariantProps<typeof markerVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		child,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: MarkerVariant;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const mergedProps = $derived({
		class: cn(markerVariants({ variant }), className),
		"data-slot": "marker",
		"data-variant": variant,
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
