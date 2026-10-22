<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";
	export const inputGroupAddonVariants = tv({
		/*
		 * Addons sit inside the pill in the current text colour. Two addons on
		 * the same side are split by a hairline.
		 */
		base: "flex h-auto cursor-text items-center justify-center gap-2 text-[0.9375rem] text-current/70 select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4 [[data-slot=input-group-addon]+&]:border-l [[data-slot=input-group-addon]+&]:border-current/40 [[data-slot=input-group-addon]+&]:pl-3",
		variants: {
			align: {
				"inline-start": "order-first self-stretch pl-5 has-[>button]:pl-1.5 has-[>kbd]:pl-3",
				"inline-end": "order-last self-stretch pr-5 has-[>button]:pr-1.5 has-[>kbd]:pr-3",
				"block-start": "order-first w-full justify-start px-5 pt-3.5 [.border-b]:border-current/40 [.border-b]:pb-3",
				"block-end": "order-last w-full justify-start px-5 pb-3 [.border-t]:border-current/40 [.border-t]:pt-3",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	});

	export type InputGroupAddonAlign = VariantProps<typeof inputGroupAddonVariants>["align"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		align = "inline-start",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		align?: InputGroupAddonAlign;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="input-group-addon"
	data-align={align}
	class={cn(inputGroupAddonVariants({ align }), className)}
	onclick={(e) => {
		if ((e.target as HTMLElement).closest("button")) {
			return;
		}
		e.currentTarget.parentElement?.querySelector("input")?.focus();
	}}
	{...restProps}
>
	{@render children?.()}
</div>
