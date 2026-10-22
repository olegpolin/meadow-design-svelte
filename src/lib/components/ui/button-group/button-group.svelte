<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	/*
	 * One pill made of segments. Inner corners go square and the ends keep the
	 * pill radius; each segment after the first draws its own 1px divider (see
	 * `button.svelte`), so trailing edges drop their border to avoid doubling.
	 * Vertical groups use the card radius at the ends, since a full pill radius
	 * would eat the whole first and last segment.
	 */
	export const buttonGroupVariants = tv({
		base: "group/button-group flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-full *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=button-group-separator]+*]:border-l-0! [&>[data-slot=button-group-separator]+*]:border-t-0! [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
		variants: {
			orientation: {
				horizontal:
					"[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:last-child)]:border-r-0 [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-full!",
				vertical:
					"flex-col [&>*:first-child]:rounded-t-lg [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:last-child)]:border-b-0 [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	});

	export type ButtonGroupOrientation = VariantProps<typeof buttonGroupVariants>["orientation"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		orientation = "horizontal",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: ButtonGroupOrientation;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="button-group"
	data-orientation={orientation}
	class={cn(buttonGroupVariants({ orientation }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
