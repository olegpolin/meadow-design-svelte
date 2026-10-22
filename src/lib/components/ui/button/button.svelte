<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

	/*
	 * Pill buttons in Manrope 700. Colours come from the semantic tokens, so the
	 * same variant works on paper, on both colour blocks and on the ink card:
	 * `outline` and `ghost` follow the current text colour and invert with it.
	 *
	 * Inside a button group every segment after the first draws a 1px divider
	 * on its leading edge (in its own text colour, softened on filled
	 * variants), and the focus ring drops its offset so it stays tight.
	 */
	export const buttonVariants = tv({
		base: "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-display font-bold outline-none select-none transition-[background-color,color,opacity,transform] duration-150 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=horizontal]/button-group:not-first:border-l group-data-[orientation=vertical]/button-group:not-first:border-t in-data-[slot=button-group]:focus-visible:ring-offset-0!",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 aria-expanded:bg-primary/90 in-data-[slot=button-group]:border-current/30",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85 aria-expanded:bg-secondary/85 in-data-[slot=button-group]:border-current/30",
				/* Border follows the text colour, so it inverts on the ink card. */
				outline: "border-2 border-current bg-transparent hover:bg-current/10 aria-expanded:bg-current/10",
				ghost: "bg-transparent hover:bg-current/10 aria-expanded:bg-current/10 in-data-[slot=button-group]:border-current/30",
				link: "h-auto rounded-xs px-0 underline decoration-2 underline-offset-4 hover:opacity-80",
				destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/40 in-data-[slot=button-group]:border-current/30",
			},
			size: {
				default: "h-12 gap-2 px-6 text-[0.9375rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
				xs: "h-8 gap-1.5 px-3.5 text-xs has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
				sm: "h-10 gap-1.5 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
				lg: "h-14 gap-2 px-7 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-5",
				icon: "size-12",
				"icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
				"icon-sm": "size-10",
				"icon-lg": "size-14 [&_svg:not([class*='size-'])]:size-5",
			},
		},
		compoundVariants: [{ variant: "link", size: ["default", "xs", "sm", "lg"], class: "h-auto px-0" }],
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
