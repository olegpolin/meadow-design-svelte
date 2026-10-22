<script lang="ts">
	import { Label } from "#lib/components/ui/label/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof Label> = $props();
</script>

<Label
	bind:ref
	data-slot="field-label"
	class={cn(
		"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
		/* A label wrapping a whole field becomes a selectable hairline card. */
		"has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-hairline has-[>[data-slot=field]]:transition-[background-color,box-shadow] has-[>[data-slot=field]]:duration-150 has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-current/5 has-[>[data-slot=field]]:has-data-checked:bg-current/10 has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring/60 has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-2 has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-background *:data-[slot=field]:p-4",
		"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Label>
