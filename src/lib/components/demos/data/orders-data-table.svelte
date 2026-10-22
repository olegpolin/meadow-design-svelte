<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Pagination from '#lib/components/ui/pagination/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { orders, formatDay, formatMoney, statusVariant, type Order } from './hollin-data.js';

	/**
	 * Sortable, filterable, selectable orders table built on plain runes state:
	 * no table library, just $state and $derived.
	 */

	type SortKey = 'id' | 'customer' | 'date' | 'total';
	type SortDir = 'asc' | 'desc';

	const perPage = 6;

	let search = $state('');
	let sortKey = $state<SortKey>('date');
	let sortDir = $state<SortDir>('desc');
	let page = $state(1);
	const selected = new SvelteSet<string>();

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return q ? orders.filter((o) => o.customer.toLowerCase().includes(q)) : orders;
	});

	const sorted = $derived.by(() => {
		const sign = sortDir === 'asc' ? 1 : -1;
		return [...filtered].sort((a, b) => {
			const x = a[sortKey];
			const y = b[sortKey];
			const byKey = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
			// Ties (several orders on one day) fall back to the order number, in the same direction.
			return (byKey || a.id.localeCompare(b.id)) * sign;
		});
	});

	const rows = $derived(sorted.slice((page - 1) * perPage, page * perPage));
	const pageSelected = $derived(rows.filter((o) => selected.has(o.id)).length);

	function sortBy(key: SortKey) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			// Numbers and dates read best newest or largest first.
			sortDir = key === 'customer' || key === 'id' ? 'asc' : 'desc';
		}
		page = 1;
	}

	function selectPage(checked: boolean) {
		for (const o of rows) {
			if (checked) selected.add(o.id);
			else selected.delete(o.id);
		}
	}

	function selectRow(o: Order, checked: boolean) {
		if (checked) selected.add(o.id);
		else selected.delete(o.id);
	}

	function clearSearch() {
		search = '';
		page = 1;
	}
</script>

{#snippet sortHead(key: SortKey, label: string, align: 'left' | 'right' = 'left')}
	{@const active = sortKey === key}
	<Table.Head
		class={align === 'right' ? 'text-right' : undefined}
		aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
	>
		<button
			type="button"
			onclick={() => sortBy(key)}
			class={[
				'-mx-1 inline-flex h-8 items-center gap-1 rounded-xs px-1 outline-none transition-[color] duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60',
				active && 'text-foreground',
				align === 'right' && 'flex-row-reverse'
			]}
		>
			{label}
			{#if !active}
				<ChevronsUpDownIcon class="size-3.5 opacity-60" aria-hidden="true" />
			{:else if sortDir === 'asc'}
				<ChevronUpIcon class="size-3.5" aria-hidden="true" />
			{:else}
				<ChevronDownIcon class="size-3.5" aria-hidden="true" />
			{/if}
		</button>
	</Table.Head>
{/snippet}

<div class="flex flex-col gap-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="w-full sm:max-w-xs">
			<Label for="orders-search" class="sr-only">Search by customer</Label>
			<Input
				id="orders-search"
				type="search"
				placeholder="Search customers"
				autocomplete="off"
				bind:value={search}
				oninput={() => (page = 1)}
			/>
		</div>
		{#if selected.size > 0}
			<div class="flex items-center gap-3 text-sm">
				<span class="tabular-nums">{selected.size} selected</span>
				<Button variant="ghost" size="sm" onclick={() => selected.clear()}>Clear selection</Button>
			</div>
		{/if}
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>
					<Checkbox
						aria-label="Select all orders on this page"
						disabled={rows.length === 0}
						bind:checked={() => rows.length > 0 && pageSelected === rows.length, (v) => selectPage(v)}
						indeterminate={pageSelected > 0 && pageSelected < rows.length}
					/>
				</Table.Head>
				{@render sortHead('id', 'Order')}
				{@render sortHead('customer', 'Customer')}
				{@render sortHead('date', 'Date')}
				<Table.Head>Status</Table.Head>
				{@render sortHead('total', 'Total', 'right')}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each rows as order (order.id)}
				{@const isSelected = selected.has(order.id)}
				<Table.Row data-state={isSelected ? 'selected' : undefined}>
					<Table.Cell>
						<Checkbox
							aria-label="Select order {order.id}"
							bind:checked={() => isSelected, (v) => selectRow(order, v)}
						/>
					</Table.Cell>
					<Table.Cell class="font-display font-bold">{order.id}</Table.Cell>
					<Table.Cell>{order.customer}</Table.Cell>
					<Table.Cell>{formatDay(order.date)}</Table.Cell>
					<Table.Cell><Badge variant={statusVariant[order.status]}>{order.status}</Badge></Table.Cell>
					<Table.Cell class="text-right">{formatMoney(order.total)}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row class="hover:bg-transparent">
					<Table.Cell colspan={6} class="whitespace-normal">
						<Empty.Root class="py-8 md:py-10">
							<Empty.Header>
								<Empty.Title>No orders from “{search.trim()}”</Empty.Title>
								<Empty.Description>
									Search matches customer names. Check the spelling or try a first name.
								</Empty.Description>
							</Empty.Header>
							<Empty.Content>
								<Button variant="outline" size="sm" onclick={clearSearch}>Clear search</Button>
							</Empty.Content>
						</Empty.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if sorted.length > 0}
		<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<p class="text-sm text-muted-foreground tabular-nums">
				{(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length} orders
			</p>
			<Pagination.Root count={sorted.length} {perPage} bind:page class="mx-0 w-auto">
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						{#each pages as p (p.key)}
							{#if p.type === 'ellipsis'}
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
