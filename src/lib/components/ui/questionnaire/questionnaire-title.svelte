<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: QuestionnairePrimitive.TitleProps = $props();
</script>

<QuestionnairePrimitive.Title
	bind:ref
	data-slot="questionnaire-title"
	class={cn(
		"font-display text-xl leading-tight font-extrabold tracking-[-0.02em] text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-3",
		className
	)}
	{...restProps}
/>
