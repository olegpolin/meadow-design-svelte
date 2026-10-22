<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<!--
	20px box with a 1.5px border in the current text colour; checked fills
	with primary and the mark is primary-foreground. The border keeps the
	surrounding text colour, so a checked box still reads on the ink card.
-->
<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn(
		"peer relative flex size-5 shrink-0 items-center justify-center rounded-xs border-[1.5px] border-current bg-transparent outline-none transition-[background-color,color,box-shadow] duration-150 after:absolute after:-inset-2.5 hover:data-unchecked:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:ring-offset-0",
		"data-checked:bg-primary data-[state=indeterminate]:bg-primary",
		"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25",
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div
			data-slot="checkbox-indicator"
			class="grid place-content-center text-primary-foreground transition-none [&>svg]:size-3.5"
		>
			{#if checked}
				<CheckIcon strokeWidth={3} />
			{:else if indeterminate}
				<MinusIcon strokeWidth={3} />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
