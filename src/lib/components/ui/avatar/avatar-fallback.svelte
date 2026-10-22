<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<!-- Initials in Manrope 700 on the warm tint. -->
<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn(
		"flex size-full items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-secondary-foreground group-data-[size=lg]/avatar:text-lg group-data-[size=sm]/avatar:text-xs",
		className
	)}
	{...restProps}
/>
