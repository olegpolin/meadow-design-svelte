<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.LinkProps = $props();
</script>

<NavigationMenuPrimitive.Link
	bind:ref
	data-slot="navigation-menu-link"
	class={cn(
		"flex items-center gap-2 rounded-md p-3 text-[0.9375rem] outline-none transition-[background-color,color] duration-150 hover:bg-current/10 focus-visible:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-0 data-active:bg-current/10 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
/>
