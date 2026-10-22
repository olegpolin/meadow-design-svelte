<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	/*
	 * Meadow bubbles. The default is the warm tint, for the person writing;
	 * "ghost" is plain text on the page, for the assistant. Tinted is the cool
	 * tint. "outline" and "ghost" follow the current text colour, so they work
	 * on the colour blocks and the ink card. Hover is a tint change only.
	 */
	export const bubbleVariants = tv({
		base: "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 data-[align=end]:self-end data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end",
		variants: {
			variant: {
				default: "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary/80",
				secondary: "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary/80",
				muted: "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_6%)]",
				tinted: "*:data-[slot=bubble-content]:bg-accent *:data-[slot=bubble-content]:text-accent-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-accent/80",
				outline: "*:data-[slot=bubble-content]:border-hairline *:data-[slot=bubble-content]:bg-transparent [&>[data-slot=bubble-content]:is(button,a):hover]:bg-current/10",
				ghost: "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-current/10",
				destructive: "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/15",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BubbleVariant = VariantProps<typeof bubbleVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		align = "start",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: BubbleVariant;
		align?: "start" | "end";
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="bubble"
	data-variant={variant}
	data-align={align}
	class={cn(bubbleVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
