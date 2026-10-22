<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		children,
		class: className,
		...restProps
	}: QuestionnairePrimitive.ChoiceProps = $props();
</script>

<!--
	A hairline row that selects. Everything follows the current text colour, so
	the rows read on paper, both colour blocks and the ink card: the indicator is
	a ring that fills with a dot (single choice) or a check (multiple), and the
	checked row takes a faint tint of the text colour.
-->
<QuestionnairePrimitive.Choice
	bind:ref
	data-slot="questionnaire-choice"
	class={cn(
		"group/questionnaire-choice relative flex min-h-12 cursor-pointer items-start gap-3 border-b border-hairline px-3 py-3 text-start text-[0.9375rem] outline-none transition-[background-color] duration-150 select-none hover:bg-current/5 data-checked:bg-current/10 data-invalid:border-destructive has-[>input:focus-visible]:z-10 has-[>input:focus-visible]:rounded-xs has-[>input:focus-visible]:ring-3 has-[>input:focus-visible]:ring-ring/60",
		"data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
		className
	)}
	{...restProps}
>
	<QuestionnairePrimitive.ChoiceInput
		data-slot="questionnaire-choice-input"
		class="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
	/>
	<span
		aria-hidden="true"
		data-slot="questionnaire-choice-indicator"
		class="pointer-events-none relative flex size-5 shrink-0 translate-y-px items-center justify-center rounded-xs border-2 border-current group-data-[type=radio]/questionnaire-choice:rounded-full"
	>
		<span
			data-slot="questionnaire-choice-indicator-dot"
			class="hidden size-2 rounded-full bg-current group-data-checked/questionnaire-choice:block group-data-[type=checkbox]/questionnaire-choice:hidden"
		></span>
		<CheckIcon
			data-slot="questionnaire-choice-indicator-check"
			strokeWidth={3}
			class="hidden size-3.5 group-data-checked/questionnaire-choice:block group-data-[type=radio]/questionnaire-choice:hidden"
		/>
	</span>
	<QuestionnairePrimitive.ChoiceLabel
		data-slot="questionnaire-choice-label"
		class="flex min-w-0 flex-1 flex-col gap-0.5 font-display leading-snug font-bold"
	>
		{@render children?.()}
	</QuestionnairePrimitive.ChoiceLabel>
	<QuestionnairePrimitive.ChoiceShortcut
		data-slot="questionnaire-choice-shortcut"
		class="pointer-events-none ms-auto hidden h-6 min-w-6 shrink-0 items-center justify-center rounded-xs border border-current/50 px-1.5 font-sans text-xs font-medium leading-none group-data-[shortcut]/questionnaire-choice:inline-flex"
	/>
</QuestionnairePrimitive.Choice>
