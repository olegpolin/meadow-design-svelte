<script lang="ts">
	import { Input } from "#lib/components/ui/input/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	bind:ref
	data-slot="input-group-control"
	class={cn("h-full flex-1 rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0 disabled:opacity-100", className)}
	bind:value
	{...props}
/>
