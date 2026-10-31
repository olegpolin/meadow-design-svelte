<script lang="ts">
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import { cn } from "#lib/utils.js";

	/**
	 * A sortable column title for a `Table.Head`: the label plus a chevron that
	 * shows the current direction. Columns that cannot sort render plain text.
	 * The column is typed by the three methods used here, because TanStack's
	 * `Column` type is invariant in its row type and `renderComponent` cannot
	 * carry that type through; the column helper has already checked it.
	 */
	type SortableColumn = {
		getCanSort: () => boolean;
		getIsSorted: () => false | "asc" | "desc";
		getToggleSortingHandler: () => undefined | ((event: unknown) => void);
	};
	let {
		column,
		title,
		align = "left",
		class: className
	}: {
		column: SortableColumn;
		title: string;
		align?: "left" | "right";
		class?: string;
	} = $props();

	const sorted = $derived(column.getIsSorted());
</script>

{#if column.getCanSort()}
	<button
		type="button"
		onclick={column.getToggleSortingHandler()}
		class={cn(
			"-mx-1 inline-flex h-8 items-center gap-1 rounded-xs px-1 outline-none transition-[color] duration-150 hover:text-current focus-visible:ring-3 focus-visible:ring-ring/60",
			sorted && "text-current",
			align === "right" && "flex-row-reverse",
			className
		)}
	>
		{title}
		{#if sorted === "asc"}
			<ChevronUpIcon class="size-3.5" aria-hidden="true" />
		{:else if sorted === "desc"}
			<ChevronDownIcon class="size-3.5" aria-hidden="true" />
		{:else}
			<ChevronsUpDownIcon class="size-3.5 opacity-60" aria-hidden="true" />
		{/if}
	</button>
{:else}
	<span class={className}>{title}</span>
{/if}
