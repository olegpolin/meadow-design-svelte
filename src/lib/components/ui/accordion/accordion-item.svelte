<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionPrimitive.ItemProps = $props();
</script>

<!-- Hairline rows in the text colour: a rule above every row and one under the last. -->
<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cn("border-t border-hairline last:border-b", className)}
	{...restProps}
/>
