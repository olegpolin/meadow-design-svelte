<script lang="ts" generics="TData extends RowData">
	import { untrack, type Snippet } from "svelte";
	import { type ColumnDef, type RowData, FlexRender, createTable } from "@tanstack/svelte-table";
	import * as Table from "#lib/components/ui/table/index.js";
	import * as Pagination from "#lib/components/ui/pagination/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { cn } from "#lib/utils.js";
	import { features, type DataTableFeatures } from "./data-table-features.js";

	/**
	 * A sortable, filterable, selectable, paged table on TanStack Table v9 and
	 * the `Table` primitives. Column definitions decide what each cell shows;
	 * this component owns the search box, the page controls and the selection
	 * count. The table is transparent, so it sits on paper, a colour block or
	 * the ink card like the rest of the kit.
	 */
	let {
		columns,
		data,
		pageSize = 10,
		filter,
		sorting = [],
		noun = "rows",
		empty,
		class: className
	}: {
		columns: ColumnDef<DataTableFeatures, TData>[];
		data: TData[];
		/** Rows per page. */
		pageSize?: number;
		/** Column id the search box filters, with its label and placeholder. */
		filter?: { column: string; label: string; placeholder?: string };
		/** Initial sort, e.g. `[{ id: "date", desc: true }]`. */
		sorting?: { id: string; desc: boolean }[];
		/** What a row is, for "1–6 of 16 orders". */
		noun?: string;
		/** Shown in place of the rows when nothing matches; receives the search text and a reset. */
		empty?: Snippet<[{ search: string; clear: () => void }]>;
		class?: string;
	} = $props();

	/* Columns and data stay live through getters; page size and sort are the starting state only. */
	const table = createTable({
		features,
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		initialState: untrack(() => ({ pagination: { pageIndex: 0, pageSize }, sorting }))
	});

	const filterColumn = $derived(filter ? table.getColumn(filter.column) : undefined);
	const search = $derived(String(filterColumn?.getFilterValue() ?? ""));
	const pagination = $derived(table.atoms.pagination.get());
	const rows = $derived(table.getRowModel().rows);
	const total = $derived(table.getFilteredRowModel().rows.length);
	const selectedCount = $derived(table.getFilteredSelectedRowModel().rows.length);
	const inputId = $props.id();

	function clearSearch() {
		filterColumn?.setFilterValue("");
	}
</script>

<div class={cn("flex flex-col gap-5", className)}>
	{#if filter || selectedCount > 0}
		<div class="flex flex-wrap items-center justify-between gap-3">
			{#if filter}
				<div class="w-full sm:max-w-xs">
					<Label for={inputId} class="sr-only">{filter.label}</Label>
					<Input
						id={inputId}
						type="search"
						placeholder={filter.placeholder ?? filter.label}
						autocomplete="off"
						value={search}
						oninput={(e) => filterColumn?.setFilterValue(e.currentTarget.value)}
					/>
				</div>
			{/if}
			{#if selectedCount > 0}
				<div class="flex items-center gap-3 text-sm">
					<span class="tabular-nums">{selectedCount} selected</span>
					<Button variant="ghost" size="sm" onclick={() => table.resetRowSelection()}>Clear selection</Button>
				</div>
			{/if}
		</div>
	{/if}

	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						{@const sorted = header.column.getIsSorted()}
						<Table.Head
							colspan={header.colSpan}
							aria-sort={header.column.getCanSort() ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}
							class={header.column.columnDef.meta?.class}
						>
							{#if !header.isPlaceholder}
								<FlexRender {header} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() ? "selected" : undefined}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell class={cell.column.columnDef.meta?.class}>
							<FlexRender {cell} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row class="hover:bg-transparent">
					<Table.Cell colspan={table.getVisibleLeafColumns().length} class="whitespace-normal">
						{#if empty}
							{@render empty({ search, clear: clearSearch })}
						{:else}
							<p class="py-8 text-center text-[0.9375rem] text-current/75">No {noun} to show.</p>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if total > pagination.pageSize}
		<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<p class="text-sm text-current/75 tabular-nums">
				{pagination.pageIndex * pagination.pageSize + 1}–{Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total}
				{noun}
			</p>
			<Pagination.Root
				count={total}
				perPage={pagination.pageSize}
				bind:page={() => pagination.pageIndex + 1, (p) => table.setPageIndex(p - 1)}
				class="mx-0 w-auto"
			>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						{#each pages as p (p.key)}
							{#if p.type === "ellipsis"}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link page={p} isActive={currentPage === p.value}>
										{p.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	{/if}
</div>
