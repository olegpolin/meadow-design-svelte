<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import SearchIcon from '@lucide/svelte/icons/search';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import OrdersTable from '#lib/components/dashboard/orders-table.svelte';
	import OrderSheet from '#lib/components/dashboard/order-sheet.svelte';
	import { formatMoney, orderTotal, type OrderStatus } from '#lib/demos/world.js';
	import { waitingOn, type ShopOrder } from '#lib/components/dashboard/data.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	/* One tab per order status, in the order an order moves through them. */
	const tabs: OrderStatus[] = ['Open', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled'];

	const emptyText: Record<OrderStatus, { title: string; body: string }> = {
		Open: { title: 'Nothing to pack right now', body: 'New web and phone orders land here first.' },
		Packed: { title: 'Nothing packed and waiting', body: 'Packed orders wait here for their van or for pickup at the yard gate.' },
		'Out for delivery': { title: 'No orders on a van', body: 'Orders move here when they leave the yard.' },
		Delivered: { title: 'Nothing delivered yet', body: 'Orders move here as the vans drop them off.' },
		Cancelled: { title: 'No cancelled orders', body: 'Cancel an open or packed order from its panel and it lands here.' }
	};

	let tab = $state<OrderStatus>('Open');
	/* The top bar search lands here as ?q=; typing here takes over from it. */
	let search = $derived(page.url.searchParams.get('q') ?? '');

	let selectedId = $state<string | null>(null);
	let sheetOpen = $state(false);
	const selected = $derived(selectedId ? shop.find(selectedId) : undefined);

	const matches = (o: ShopOrder) => {
		const q = search.trim().toLowerCase().replace(/^#/, '');
		return !q || o.customer.name.toLowerCase().includes(q) || o.id.includes(q);
	};

	const byTab = $derived(
		Object.fromEntries(tabs.map((t) => [t, shop.byStatus(t).filter(matches)])) as Record<OrderStatus, ShopOrder[]>
	);

	const packValue = $derived(shop.toPack.reduce((sum, o) => sum + orderTotal(o), 0));
	const preorders = $derived(shop.byStatus('Open').filter((o) => waitingOn(o)).length);

	function openOrder(order: ShopOrder) {
		selectedId = order.id;
		sheetOpen = true;
	}

	/* ?order=4479 (from Today or the search box) opens that order on arrival. */
	afterNavigate(({ to }) => {
		const id = to?.url.searchParams.get('order');
		const order = id ? shop.find(`#${id.replace(/^#/, '')}`) : undefined;
		if (!order) return;
		tab = order.status;
		openOrder(order);
	});
</script>

<svelte:head>
	<title>Orders · Hollin Nursery</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex flex-col gap-1">
			<h1 class="display-3">Orders</h1>
			<p class="text-[0.9375rem] text-muted-foreground tabular-nums">
				{shop.toPack.length} to pack, worth {formatMoney(packValue)}.
				{preorders} {preorders === 1 ? 'pre-order waits' : 'pre-orders wait'} for stock. Packed orders go on their van
				or wait at the yard gate.
			</p>
		</div>
		<div class="w-full sm:max-w-72">
			<InputGroup.Root class="h-10">
				<InputGroup.Addon>
					<SearchIcon aria-hidden="true" />
				</InputGroup.Addon>
				<InputGroup.Input
					type="search"
					aria-label="Filter orders by customer or number"
					placeholder="Customer or order number"
					autocomplete="off"
					bind:value={search}
				/>
			</InputGroup.Root>
		</div>
	</div>

	<Tabs.Root bind:value={tab}>
		<Tabs.List class="no-scrollbar justify-start overflow-x-auto">
			{#each tabs as t (t)}
				<Tabs.Trigger value={t} class="flex-none">
					{t}
					<span class="tabular-nums opacity-70">{byTab[t].length}</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each tabs as t (t)}
			<Tabs.Content value={t} class="mt-2">
				{#if byTab[t].length > 0}
					<OrdersTable orders={byTab[t]} label="{t} orders" onOpen={openOrder} />
				{:else if search.trim()}
					<Empty.Root class="rounded-none border-t py-12 md:py-14">
						<Empty.Header>
							<Empty.Title>No {t.toLowerCase()} orders match “{search.trim()}”</Empty.Title>
							<Empty.Description>Search looks at customer names and order numbers.</Empty.Description>
						</Empty.Header>
						<Empty.Content>
							<Button variant="outline" size="sm" onclick={() => (search = '')}>Clear search</Button>
						</Empty.Content>
					</Empty.Root>
				{:else}
					<Empty.Root class="rounded-none border-t py-12 md:py-14">
						<Empty.Header>
							<Empty.Title>{emptyText[t].title}</Empty.Title>
							<Empty.Description>{emptyText[t].body}</Empty.Description>
						</Empty.Header>
						<Empty.Content>
							<Button variant="outline" size="sm" href="/dashboard">Back to Today</Button>
						</Empty.Content>
					</Empty.Root>
				{/if}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>

<OrderSheet order={selected} bind:open={sheetOpen} />
