<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class="overflow-hidden text-base duration-200 data-open:animate-accordion-down data-closed:animate-accordion-up"
	{...restProps}
>
	<div
		class={cn(
			"max-w-[42rem] pr-9 pb-6 leading-normal text-muted-foreground [&_a]:font-bold [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:opacity-80 [&_p:not(:last-child)]:mb-3",
			className
		)}
	>
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
