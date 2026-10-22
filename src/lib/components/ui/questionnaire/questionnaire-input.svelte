<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: QuestionnairePrimitive.InputProps = $props();
</script>

<div
	data-slot="questionnaire-input-wrapper"
	class="w-full group/questionnaire-input relative min-w-0"
>
	<QuestionnairePrimitive.Input
		bind:ref
		data-slot="questionnaire-input"
		class={cn(
			// Same pill as the Meadow input: a hairline in the text colour on a transparent ground.
			"h-12 w-full min-w-0 rounded-full border border-hairline bg-transparent px-5 text-[0.9375rem] outline-none transition-[border-color,box-shadow,opacity] duration-150 placeholder:text-current/55 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		{...restProps}
	/>
</div>
