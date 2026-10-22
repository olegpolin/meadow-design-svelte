<script lang="ts">
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Table from '#lib/components/ui/table/index.js';
	import { formatMoney, orderItems, orderTotal } from '#lib/demos/world.js';
	import { methodLabel, relativeDay, type ShopOrder } from './data.js';

	/**
	 * Sortable orders table. Clicking a row opens the order; the order number
	 * is a real button, so the same works from the keyboard.
	 */
	let {
		orders,
		label,
		onOpen
	}: { orders: ShopOrder[]; label: string; onOpen: (order: ShopOrder) => void } = $props();

	type SortKey = 'id' | 'customer' | 'due' | 'total';
	let sortKey = $state<SortKey>('due');
	let sortDir = $state<'asc' | 'desc'>('asc');

	const value = (o: ShopOrder, key: SortKey) =>
		key === 'total' ? orderTotal(o) : key === 'customer' ? o.customer.name : key === 'due' ? (o.due ?? '') : o.id;

	const rows = $derived.by(() => {
		const sign = sortDir === 'asc' ? 1 : -1;
		return [...orders].sort((a, b) => {
			const x = value(a, sortKey);
			const y = value(b, sortKey);
			const primary = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
			return (primary || a.id.localeCompare(b.id)) * sign;
		});
	});

	function sortBy(key: SortKey) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = key === 'total' ? 'desc' : 'asc';
		}
	}
</script>

{#snippet sortHead(key: SortKey, text: string, align: 'left' | 'right' = 'left')}
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
			{text}
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

<Table.Root aria-label={label} class="border-t">
	<Table.Header>
		<Table.Row class="hover:bg-transparent">
			{@render sortHead('id', 'Order')}
			{@render sortHead('customer', 'Customer')}
			<Table.Head class="text-right">Items</Table.Head>
			{@render sortHead('due', 'Due')}
			<Table.Head>Method</Table.Head>
			{@render sortHead('total', 'Total', 'right')}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each rows as order (order.id)}
			<Table.Row class="cursor-pointer" onclick={() => onOpen(order)}>
				<Table.Cell>
					<button
						type="button"
						class="rounded-xs font-display font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
						onclick={(e) => {
							e.stopPropagation();
							onOpen(order);
						}}
					>
						{order.id}<span class="sr-only">, open order</span>
					</button>
				</Table.Cell>
				<Table.Cell class="max-w-56 truncate">
					{order.customer.name}
					{#if order.returned}<span class="text-muted-foreground">, returned</span>{/if}
				</Table.Cell>
				<Table.Cell class="text-right">{orderItems(order)}</Table.Cell>
				<Table.Cell>{relativeDay(order.due)}</Table.Cell>
				<Table.Cell>{methodLabel(order)}</Table.Cell>
				<Table.Cell class="text-right">{formatMoney(orderTotal(order))}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
