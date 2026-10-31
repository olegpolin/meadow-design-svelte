import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
	type CellData,
	type RowData,
	type TableFeatures
} from "@tanstack/svelte-table";

/**
 * The TanStack Table v9 features every Meadow data table opts into: sorting,
 * a text filter, pagination, row selection and column visibility. Anything not
 * listed here is tree-shaken out, including the sort and filter functions, so
 * a column that needs another built-in has to register it here first.
 */
export const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text }
});

/** Pass as the first generic to `ColumnDef`, `Column`, `Row` and `Table` so they know these feature APIs. */
export type DataTableFeatures = typeof features;

declare module "@tanstack/table-core" {
	interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
		/** Classes for the column's head and cells, e.g. `text-right` for money. */
		class?: string;
	}
}
