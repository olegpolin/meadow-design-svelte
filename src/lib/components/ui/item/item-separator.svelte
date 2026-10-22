<script lang="ts">
	import { Separator } from "#lib/components/ui/separator/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof Separator> = $props();
</script>

<!-- For loose lists of items outside an ItemGroup; inside a group the hairlines come from the group. -->
<Separator
	bind:ref
	data-slot="item-separator"
	orientation="horizontal"
	class={cn("my-1", className)}
	{...restProps}
/>
