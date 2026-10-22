<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import {
		buttonVariants,
		type ButtonSize,
		type ButtonVariant,
	} from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		size = "default",
		variant = "outline",
		...restProps
	}: QuestionnairePrimitive.PreviousProps & {
		size?: ButtonSize;
		variant?: ButtonVariant;
	} = $props();
</script>

<QuestionnairePrimitive.Previous
	bind:ref
	data-slot="questionnaire-previous"
	data-size={size}
	data-variant={variant}
	class={cn(
		buttonVariants({ size, variant }),
		"col-start-1 row-start-1 justify-self-start",
		className
	)}
	{...restProps}
/>
