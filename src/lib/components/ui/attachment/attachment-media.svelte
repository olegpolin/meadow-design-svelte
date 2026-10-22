<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const attachmentMediaVariants = tv({
		// Inner radius = chip radius minus its padding.
		base: "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-secondary text-secondary-foreground group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-[0.25rem] group-data-[orientation=vertical]/attachment:w-full group-data-[orientation=vertical]/attachment:rounded-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive",
		variants: {
			variant: {
				icon: "",
				image:
					"bg-muted opacity-60 transition-opacity duration-150 group-data-[state=idle]/attachment:opacity-100 group-data-[state=done]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
			},
		},
		defaultVariants: {
			variant: "icon",
		},
	});

	export type AttachmentMediaVariant = VariantProps<typeof attachmentMediaVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "icon",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AttachmentMediaVariant;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="attachment-media"
	data-variant={variant}
	class={cn(attachmentMediaVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
