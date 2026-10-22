<script lang="ts" module>
	/*
	 * Meadow inputs are pills with a 1px hairline in the current text colour on
	 * a transparent ground, so the same input reads on paper, on both colour
	 * blocks and on the ink card. The hairline stays on focus and the shared
	 * focus ring goes around it.
	 */
	export const inputBase =
		"h-12 w-full min-w-0 rounded-full border border-hairline bg-transparent px-5 text-[0.9375rem] outline-none transition-[border-color,box-shadow,opacity] duration-150 placeholder:text-current/55 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 focus-visible:aria-invalid:ring-destructive/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			inputBase,
			"pl-1.5 file:mr-3 file:inline-flex file:h-9 file:rounded-full file:border-0 file:bg-current/10 file:px-4 file:font-display file:text-sm file:font-bold file:text-current",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(inputBase, className)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
