<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn("border-b border-hairline transition-[background-color] duration-150 hover:bg-current/5 has-aria-expanded:bg-current/5 data-[state=selected]:bg-current/10", className)}
	{...restProps}
>
	{@render children?.()}
</tr>
