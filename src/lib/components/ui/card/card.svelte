<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	/*
	 * Meadow cards: 20px radius, roomy padding, no shadow. `paper` is the
	 * hairline card; `warm`, `cool` and `ink` are borderless colour blocks (the
	 * "stamp" cards of the system), built from the semantic tokens so they follow
	 * the palette and the mode.
	 */
	export const cardVariants = tv({
		base: "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg py-(--card-spacing) text-base [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
		variants: {
			tone: {
				paper: "border bg-card text-card-foreground",
				warm: "bg-secondary text-secondary-foreground",
				cool: "bg-accent text-accent-foreground",
				ink: "bg-primary text-primary-foreground",
			},
		},
		defaultVariants: {
			tone: "paper",
		},
	});

	export type CardTone = VariantProps<typeof cardVariants>["tone"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		tone = "paper",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		size?: "default" | "sm";
		tone?: CardTone;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	data-size={size}
	data-tone={tone}
	class={cn(cardVariants({ tone }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
