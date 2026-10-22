<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	/*
	 * Small pills in Manrope 700. `default` is ink; on the ink card (or inside
	 * an ink button) it flips to the card's foreground so it never disappears.
	 * `outline`, `ghost` and `link` follow the current text colour.
	 */
	export const badgeVariants = tv({
		base: "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent px-2.5 font-display text-xs font-bold tabular-nums outline-none transition-[background-color,color,opacity] duration-150 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-3 aria-invalid:ring-destructive/30 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!",
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground [a]:hover:bg-primary/90 [.bg-primary_&]:bg-primary-foreground [.bg-primary_&]:text-primary",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/85",
				accent: "bg-accent text-accent-foreground [a]:hover:bg-accent/85",
				destructive: "bg-destructive text-destructive-foreground [a]:hover:bg-destructive/90 focus-visible:ring-destructive/40",
				outline: "border-hairline bg-transparent [a]:hover:bg-current/10",
				ghost: "bg-transparent hover:bg-current/10",
				link: "h-auto rounded-xs px-0 underline decoration-2 underline-offset-4 hover:opacity-80",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
