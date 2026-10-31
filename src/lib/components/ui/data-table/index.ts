import Root from "./data-table.svelte";
import ColumnHeader from "./data-table-column-header.svelte";
import Checkbox from "./data-table-checkbox.svelte";

export { features, type DataTableFeatures } from "./data-table-features.js";
export {
	Root,
	ColumnHeader,
	Checkbox,
	//
	Root as DataTable,
	ColumnHeader as DataTableColumnHeader,
	Checkbox as DataTableCheckbox
};
