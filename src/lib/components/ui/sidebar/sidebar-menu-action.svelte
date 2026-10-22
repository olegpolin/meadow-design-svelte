<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		showOnHover = false,
		children,
		child,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		showOnHover?: boolean;
	} = $props();

	const mergedProps = $derived({
		class: cn(
			"absolute top-1 right-1 flex size-8 items-center justify-center rounded-full text-sidebar-foreground outline-hidden transition-[background-color,color,opacity] duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/60 peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=sm]/menu-button:top-0 peer-data-[size=default]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-2 group-data-[collapsible=icon]:hidden after:absolute after:-inset-1 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
			showOnHover &&
				"group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
			className
		),
		"data-slot": "sidebar-menu-action",
		"data-sidebar": "menu-action",
		...restProps,
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
