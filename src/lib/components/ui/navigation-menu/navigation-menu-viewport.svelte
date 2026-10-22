<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<div
	class={cn(
		"absolute start-0 top-full isolate z-50 flex justify-center"
	)}
>
	<NavigationMenuPrimitive.Viewport
		bind:ref
		data-slot="navigation-menu-viewport"
		class={cn(
			"relative mt-2 w-full origin-top overflow-hidden rounded-lg border bg-popover text-popover-foreground duration-200 ease-out data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
			"h-[calc(var(--bits-navigation-menu-viewport-height)_+_2px)] transition-[width,height] md:w-[calc(var(--bits-navigation-menu-viewport-width)_+_2px)]",
			className
		)}
		{...restProps}
	/>
</div>
