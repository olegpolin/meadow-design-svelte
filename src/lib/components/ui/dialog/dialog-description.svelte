<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	data-slot="dialog-description"
	class={cn("text-[0.9375rem] leading-normal text-muted-foreground *:[a]:font-bold *:[a]:text-foreground *:[a]:underline *:[a]:decoration-2 *:[a]:underline-offset-4 *:[a]:hover:opacity-80", className)}
	{...restProps}
/>
