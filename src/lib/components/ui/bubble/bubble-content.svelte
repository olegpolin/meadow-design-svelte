<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		child,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const mergedProps = $derived({
		class: cn(
			// Rounded with one tighter top corner on the sender's side.
			"w-fit max-w-full min-w-0 overflow-hidden rounded-lg rounded-ss-sm border border-transparent px-4 py-2.5 text-[0.9375rem] leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-ss-lg group-data-[align=end]/bubble:rounded-se-sm group-data-[align=end]/message:rounded-ss-lg group-data-[align=end]/message:rounded-se-sm [button]:text-left [button,a]:outline-none [button,a]:transition-[background-color] [button,a]:duration-150 [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/60 [button,a]:focus-visible:ring-offset-2 [button,a]:focus-visible:ring-offset-background",
			className
		),
		"data-slot": "bubble-content",
		...restProps,
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render mergedProps.children?.()}
	</div>
{/if}
