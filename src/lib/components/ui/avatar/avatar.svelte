<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		loadingStatus = $bindable("loading"),
		size = "default",
		class: className,
		...restProps
	}: AvatarPrimitive.RootProps & {
		/** sm 32px, default 40px, lg 56px. */
		size?: "default" | "sm" | "lg";
	} = $props();
</script>

<!-- Round. A faint ring in the text colour keeps the edge visible on the warm block, where the fallback tint matches the surface. -->
<AvatarPrimitive.Root
	bind:ref
	bind:loadingStatus
	data-slot="avatar"
	data-size={size}
	class={cn(
		"group/avatar relative flex size-10 shrink-0 rounded-full select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-current/15 data-[size=lg]:size-14 data-[size=sm]:size-8",
		className
	)}
	{...restProps}
/>
