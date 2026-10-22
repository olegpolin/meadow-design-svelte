<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	const inputGroupButtonVariants = tv({
		/* Pills that fit inside the 48px input pill, with the inner ring offset dropped. */
		base: "flex items-center gap-1.5 focus-visible:ring-offset-0",
		variants: {
			size: {
				xs: "h-8 px-3.5 text-[0.8125rem] [&>svg:not([class*='size-'])]:size-3.5",
				sm: "h-9 px-4 text-sm",
				"icon-xs": "size-8 p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-3.5",
				"icon-sm": "size-9 p-0 has-[>svg]:p-0",
			},
		},
		defaultVariants: {
			size: "xs",
		},
	});

	export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>["size"];
</script>

<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		type = "button",
		variant = "ghost",
		size = "xs",
		...restProps
	}: Omit<ComponentProps<typeof Button>, "href" | "size"> & {
		size?: InputGroupButtonSize;
	} = $props();
</script>

<Button
	bind:ref
	{type}
	data-size={size}
	{variant}
	class={cn(inputGroupButtonVariants({ size }), className)}
	{...restProps}
>
	{@render children?.()}
</Button>
