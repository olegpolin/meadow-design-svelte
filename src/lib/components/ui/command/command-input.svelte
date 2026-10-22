<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import SearchIcon from "@lucide/svelte/icons/search";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<!-- A plain row with a hairline under it, not a pill: the palette is the field. -->
<div
	data-slot="command-input-wrapper"
	class="flex h-12 shrink-0 items-center gap-2.5 border-b px-4 has-[input:disabled]:opacity-50"
>
	<SearchIcon class="size-4 shrink-0 opacity-70" aria-hidden="true" />
	<CommandPrimitive.Input
		bind:value
		bind:ref
		data-slot="command-input"
		class={cn(
			"h-full w-full min-w-0 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
			className
		)}
		{...restProps}
	/>
</div>
