<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLSelectAttributes } from "svelte/elements";

	type NativeSelectProps = Omit<WithElementRef<HTMLSelectAttributes>, "size"> & {
		size?: "sm" | "default";
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size = "default",
		children,
		...restProps
	}: NativeSelectProps = $props();
</script>

<div
	class={cn(
		"group/native-select relative w-fit has-[select:disabled]:opacity-50",
		className
	)}
	data-slot="native-select-wrapper"
	data-size={size}
>
	<select
		bind:value
		bind:this={ref}
		data-slot="native-select"
		data-size={size}
		class="h-12 w-full min-w-0 cursor-pointer appearance-none rounded-full border border-hairline bg-transparent py-0 pr-12 pl-5 text-[0.9375rem] outline-none transition-[border-color,box-shadow,background-color] duration-150 select-none hover:bg-current/5 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-10 data-[size=sm]:pr-10 data-[size=sm]:pl-4 data-[size=sm]:text-sm"
		{...restProps}
	>
		{@render children?.()}
	</select>
	<ChevronDownIcon class="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 select-none text-current/70 group-data-[size=sm]/native-select:right-4" aria-hidden data-slot="native-select-icon" />
</div>
