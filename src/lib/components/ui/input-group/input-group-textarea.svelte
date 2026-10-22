<script lang="ts">
	import { Textarea } from "#lib/components/ui/textarea/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea
	bind:ref
	data-slot="input-group-control"
	class={cn("flex-1 resize-none rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0 disabled:opacity-100", className)}
	bind:value
	{...props}
/>
