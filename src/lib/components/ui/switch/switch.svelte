<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		size = "default",
		...restProps
	}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> & {
		size?: "sm" | "default";
	} = $props();
</script>

<!--
	48x28 pill (40x24 small). Off: a 2px outline and thumb in the current text
	colour, so it inverts on the ink card. On: filled with primary, thumb in
	primary-foreground.
-->
<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	data-size={size}
	class={cn(
		"peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-current bg-transparent outline-none transition-[background-color,box-shadow,opacity] duration-150 after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[size=default]:h-7 data-[size=default]:w-12 data-[size=sm]:h-6 data-[size=sm]:w-10 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:ring-offset-0",
		"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25",
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		data-slot="switch-thumb"
		class={cn(
			"pointer-events-none block rounded-full bg-current ring-0 transition-[translate,background-color] duration-150 ease-out data-checked:bg-primary-foreground",
			"group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-unchecked:translate-x-1 group-data-[size=default]/switch:data-checked:translate-x-6",
			"group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:data-unchecked:translate-x-1 group-data-[size=sm]/switch:data-checked:translate-x-5",
			"rtl:group-data-[size=default]/switch:data-checked:-translate-x-6 rtl:group-data-[size=sm]/switch:data-checked:-translate-x-5 rtl:data-unchecked:-translate-x-1"
		)}
	/>
</SwitchPrimitive.Root>
