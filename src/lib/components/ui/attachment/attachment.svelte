<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const attachmentVariants = tv({
		// A hairline chip on paper. The focus ring shows when the whole-chip trigger has focus; actions carry their own ring.
		base: "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-md border bg-card text-card-foreground transition-[background-color,border-color] duration-150 has-[>a,>button]:hover:bg-muted has-[[data-slot=attachment-trigger]:focus-visible]:ring-3 has-[[data-slot=attachment-trigger]:focus-visible]:ring-ring/60 has-[[data-slot=attachment-trigger]:focus-visible]:ring-offset-2 has-[[data-slot=attachment-trigger]:focus-visible]:ring-offset-background data-[state=error]:border-destructive data-[state=idle]:border-dashed",
		variants: {
			size: {
				default: "gap-3 p-2 has-data-[slot=attachment-content]:pe-3 text-sm",
				sm: "gap-2.5 p-1.5 has-data-[slot=attachment-content]:pe-2.5 text-[0.8125rem]",
				xs: "gap-2 p-1 has-data-[slot=attachment-content]:pe-2 text-xs rounded-sm",
			},
			orientation: {
				horizontal: "min-w-48 items-center",
				vertical: "w-28 flex-col gap-2 has-data-[slot=attachment-content]:w-32 has-data-[slot=attachment-content]:pb-2.5 has-data-[slot=attachment-content]:pe-2",
			},
		},
	});

	export type AttachmentSize = VariantProps<typeof attachmentVariants>["size"];
	export type AttachmentOrientation = VariantProps<typeof attachmentVariants>["orientation"];
	export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		state = "done",
		size = "default",
		orientation = "horizontal",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		state?: AttachmentState;
		size?: AttachmentSize;
		orientation?: AttachmentOrientation;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="attachment"
	data-state={state}
	data-size={size}
	data-orientation={orientation}
	class={cn(attachmentVariants({ size, orientation }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
