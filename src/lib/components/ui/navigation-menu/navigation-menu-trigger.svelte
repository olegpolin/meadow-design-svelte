<script lang="ts" module>
	import { tv } from "tailwind-variants";
	import { cn } from "#lib/utils.js";

	/* Pill ghost trigger; the tint follows the current colour, so it works on any surface. */
	export const navigationMenuTriggerStyle = tv({
		base: "group/navigation-menu-trigger inline-flex h-10 w-max items-center justify-center gap-1 rounded-full bg-transparent px-4 font-display text-[0.9375rem] font-bold outline-none select-none transition-[background-color,color,opacity] duration-150 hover:bg-current/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-open:bg-current/10 data-active:bg-current/10",
	});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn(navigationMenuTriggerStyle(), "group", className)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="relative top-px size-4 transition-[rotate] duration-200 group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
</NavigationMenuPrimitive.Trigger>
