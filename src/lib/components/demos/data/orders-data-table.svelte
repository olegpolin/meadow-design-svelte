<script lang="ts">
	import { createColumnHelper, renderComponent, renderSnippet } from '@tanstack/svelte-table';
	import * as DataTable from '#lib/components/ui/data-table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { orders, formatDay, formatMoney, statusVariant, type Order } from './hollin-data.js';

	/**
	 * October's orders in the DataTable: sortable columns, a customer search,
	 * row selection and six rows a page. The column definitions are the whole
	 * recipe; the table component does the rest.
	 */
	const col = createColumnHelper<DataTable.DataTableFeatures, Order>();

	const columns = col.columns([
		col.display({
			id: 'select',
			header: ({ table }) =>
				renderComponent(DataTable.Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (v: boolean) => table.toggleAllPageRowsSelected(!!v),
					'aria-label': 'Select all orders on this page'
				}),
			cell: ({ row }) =>
				renderComponent(DataTable.Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (v: boolean) => row.toggleSelected(!!v),
					'aria-label': `Select order ${row.original.id}`
				}),
			enableSorting: false,
			enableHiding: false
		}),
		col.accessor('id', {
			header: ({ column }) => renderComponent(DataTable.ColumnHeader, { column, title: 'Order' }),
			cell: ({ getValue }) => renderSnippet(orderId, getValue()),
			sortFn: 'alphanumeric'
		}),
		col.accessor('customer', {
			header: ({ column }) => renderComponent(DataTable.ColumnHeader, { column, title: 'Customer' }),
			filterFn: 'includesString',
			sortFn: 'text'
		}),
		col.accessor('date', {
			header: ({ column }) => renderComponent(DataTable.ColumnHeader, { column, title: 'Date' }),
			cell: ({ getValue }) => formatDay(getValue()),
			sortFn: 'datetime'
		}),
		col.accessor('status', {
			header: 'Status',
			cell: ({ getValue }) => renderSnippet(status, getValue()),
			enableSorting: false
		}),
		col.accessor('total', {
			header: ({ column }) => renderComponent(DataTable.ColumnHeader, { column, title: 'Total', align: 'right' }),
			cell: ({ getValue }) => formatMoney(getValue()),
			sortFn: 'basic',
			meta: { class: 'text-right' }
		})
	]);
</script>

{#snippet orderId(id: string)}
	<span class="font-display font-bold">{id}</span>
{/snippet}

{#snippet status(value: Order['status'])}
	<Badge variant={statusVariant[value]}>{value}</Badge>
{/snippet}

<DataTable.Root
	{columns}
	data={orders}
	pageSize={6}
	noun="orders"
	sorting={[{ id: 'date', desc: true }]}
	filter={{ column: 'customer', label: 'Search by customer', placeholder: 'Search customers' }}
>
	{#snippet empty({ search, clear })}
		<Empty.Root class="py-8 md:py-10">
			<Empty.Header>
				<Empty.Title>No orders from “{search.trim()}”</Empty.Title>
				<Empty.Description>Search matches customer names. Check the spelling or try a first name.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm" onclick={clear}>Clear search</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</DataTable.Root>
