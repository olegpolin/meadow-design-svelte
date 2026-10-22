<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const codeBlockVariants = tv({
		/*
		 * Paper with an ink hairline, so it reads the same on the page, the colour
		 * blocks and the ink card. Token colours come from the Meadow theme in
		 * `$lib/highlighter.ts`, which only uses semantic tokens.
		 */
		base: "group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-sm text-card-foreground data-[size=sm]:rounded-md data-[size=sm]:text-xs has-[>[data-slot=code-block-content]:focus-visible]:ring-3 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/60 has-[>[data-slot=code-block-content]:focus-visible]:ring-offset-2 has-[>[data-slot=code-block-content]:focus-visible]:ring-offset-background",
		variants: {
			variant: {
				default: "border-border",
				destructive: "border-destructive text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type CodeBlockVariant = VariantProps<typeof codeBlockVariants>["variant"];
	export type CodeBlockSize = "default" | "sm";
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: CodeBlockVariant;
		size?: CodeBlockSize;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="code-block"
	data-variant={variant}
	data-size={size}
	class={cn(codeBlockVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
