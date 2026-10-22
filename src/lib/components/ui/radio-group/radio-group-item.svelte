<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<!-- 20px circle; checked is a heavier ring in the current colour with a dot inside. -->
<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		"group/radio-group-item peer relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent outline-none transition-[background-color,border-width,box-shadow] duration-150 after:absolute after:-inset-2.5 hover:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-2 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:ring-offset-0",
		"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span data-slot="radio-group-indicator" class="flex items-center justify-center">
			{#if checked}
				<span class="size-2.5 rounded-full bg-current"></span>
			{/if}
		</span>
	{/snippet}
</RadioGroupPrimitive.Item>
