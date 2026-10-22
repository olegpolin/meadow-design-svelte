<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	/*
	 * Pill toggles in Manrope 700. Off is transparent and follows the current
	 * text colour; on is filled with ink (`bg-primary`). On the ink card, where
	 * `bg-primary` is the surface itself, the pressed fill swaps to the card's
	 * foreground so it still reads as pressed.
	 */
	export const toggleVariants = tv({
		base: "group/toggle inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold outline-none select-none transition-[background-color,color,border-color,opacity] duration-150 hover:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90 [.bg-primary_&]:data-[state=on]:bg-primary-foreground [.bg-primary_&]:data-[state=on]:text-primary [.bg-primary_&]:data-[state=on]:hover:bg-primary-foreground/90 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "bg-transparent",
				/* Border follows the text colour; when pressed it matches the fill. */
				outline:
					"border-2 border-current bg-transparent data-[state=on]:border-primary [.bg-primary_&]:data-[state=on]:border-primary-foreground",
			},
			size: {
				default: "h-12 min-w-12 px-4 text-[0.9375rem]",
				sm: "h-10 min-w-10 px-3 text-sm",
				lg: "h-14 min-w-14 px-[1.125rem] text-base [&_svg:not([class*='size-'])]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
	export type ToggleSize = VariantProps<typeof toggleVariants>["size"];
	export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = "default",
		variant = "default",
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root
	bind:ref
	bind:pressed
	data-slot="toggle"
	class={cn(toggleVariants({ variant, size }), className)}
	{...restProps}
/>
