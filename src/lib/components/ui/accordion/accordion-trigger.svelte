<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps["level"];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			"group/accordion-trigger flex flex-1 items-start justify-between gap-4 rounded-sm py-5 text-left font-display text-lg leading-tight font-extrabold tracking-[-0.02em] decoration-2 underline-offset-[5px] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 md:py-6 md:text-xl",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<ChevronDownIcon
			data-slot="accordion-trigger-icon"
			aria-hidden="true"
			class="pointer-events-none mt-0.5 size-5 shrink-0 transition-transform duration-200 ease-out group-aria-expanded/accordion-trigger:rotate-180 md:mt-1"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
