<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const bubbleReactionsVariants = tv({
		base: "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border bg-background px-2 py-0.5 text-sm text-foreground tabular-nums has-[button]:p-0 group-data-[variant=ghost]/bubble:static group-data-[variant=ghost]/bubble:translate-y-0 group-data-[variant=ghost]/bubble:data-[align=end]:self-end",
		variants: {
			side: {
				top: "top-0 -translate-y-3/4",
				bottom: "bottom-0 translate-y-3/4",
			},
			align: {
				start: "left-3",
				end: "right-3",
			},
		},
		defaultVariants: {
			side: "bottom",
			align: "end",
		},
	});

	export type BubbleReactionsSide = VariantProps<typeof bubbleReactionsVariants>["side"];
	export type BubbleReactionsAlign = VariantProps<typeof bubbleReactionsVariants>["align"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		side = "bottom",
		align = "end",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		side?: BubbleReactionsSide;
		align?: BubbleReactionsAlign;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="bubble-reactions"
	data-align={align}
	data-side={side}
	class={cn(bubbleReactionsVariants({ side, align }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
