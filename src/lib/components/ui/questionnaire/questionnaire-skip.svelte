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
		variant = "ghost",
		...restProps
	}: QuestionnairePrimitive.SkipProps & {
		size?: ButtonSize;
		variant?: ButtonVariant;
	} = $props();
</script>

<QuestionnairePrimitive.Skip
	bind:ref
	data-slot="questionnaire-skip"
	data-size={size}
	data-variant={variant}
	class={cn(
		buttonVariants({ size, variant }),
		"col-start-2 row-start-1 justify-self-end",
		className
	)}
	{...restProps}
/>
