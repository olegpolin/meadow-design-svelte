<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
	bind:ref
	data-slot="alert-dialog-description"
	class={cn("text-[0.9375rem] leading-normal text-pretty text-muted-foreground *:[a]:font-bold *:[a]:text-foreground *:[a]:underline *:[a]:decoration-2 *:[a]:underline-offset-4 *:[a]:hover:opacity-80", className)}
	{...restProps}
/>
