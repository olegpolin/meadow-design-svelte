<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		child: childProp,
		children,
		...restProps
	}: QuestionnairePrimitive.ProgressProps = $props();
</script>

<!--
	"Question 2 of 3" over a thin bar in the ink progress style: a track of the
	text colour at 15% with a full-strength fill, so it reads on every surface.
	Pass `child` or `children` to replace it.
-->
<QuestionnairePrimitive.Progress
	bind:ref
	data-slot="questionnaire-progress"
	class={cn(
		"flex w-full min-w-[14ch] flex-col gap-2 font-display text-xs font-bold tabular-nums",
		className
	)}
	{...restProps}
>
	{#snippet child(state)}
		{#if childProp}
			{@render childProp(state)}
		{:else}
			<div {...state.props}>
				{#if children}
					{@render children()}
				{:else if state.total}
					<span>Question {state.current} of {state.total}</span>
					<span
						aria-hidden="true"
						data-slot="questionnaire-progress-track"
						class="relative block h-1.5 w-full overflow-hidden rounded-full bg-current/15"
					>
						<span
							data-slot="questionnaire-progress-indicator"
							class="absolute inset-0 origin-left rounded-full bg-current transition-transform duration-200 ease-out rtl:origin-right"
							style:transform="scaleX({state.current / state.total})"
						></span>
					</span>
				{/if}
			</div>
		{/if}
	{/snippet}
</QuestionnairePrimitive.Progress>
