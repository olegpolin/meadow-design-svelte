<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { buttonVariants, type ButtonSize } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		size = "icon-sm",
		isActive,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps & {
		size?: ButtonSize;
		isActive: boolean;
	} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	aria-current={isActive ? "page" : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	data-size={size}
	class={cn(
		buttonVariants({ size, variant: "ghost" }),
		"text-[0.9375rem] tabular-nums",
		// On the ink card the active page swaps to the card's foreground so it still shows.
		isActive &&
			"bg-primary text-primary-foreground hover:bg-primary/90 [.bg-primary_&]:bg-primary-foreground [.bg-primary_&]:text-primary [.bg-primary_&]:hover:bg-primary-foreground/90",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.Page>
