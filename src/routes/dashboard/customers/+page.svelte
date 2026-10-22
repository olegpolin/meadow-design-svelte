<script lang="ts">
	import SearchIcon from '@lucide/svelte/icons/search';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { customerList, formatMoney, orderTotal, shop as hollin } from '#lib/demos/world.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	let search = $state('');

	/* Orders and spend come from this month's ledger, so they match the Orders page. */
	const stats = $derived(
		Object.fromEntries(
			customerList.map((c) => {
				const mine = shop.orders.filter((o) => o.customer.id === c.id);
				const live = mine.filter((o) => o.status !== 'Cancelled' && !o.returned);
				return [
					c.id,
					{
						orders: mine.length,
						spend: live.reduce((sum, o) => sum + orderTotal(o), 0),
						inProgress: mine.filter((o) => o.status === 'Open' || o.status === 'Packed' || o.status === 'Out for delivery').length
					}
				];
			})
		)
	);

	/* Biggest spenders first: the people Nell knows by name. */
	const rows = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return customerList
			.filter((c) => !q || c.name.toLowerCase().includes(q) || c.town.toLowerCase().includes(q))
			.sort((a, b) => stats[b.id].spend - stats[a.id].spend || a.name.localeCompare(b.name));
	});

	const tradeCount = customerList.filter((c) => c.trade).length;
</script>

<svelte:head>
	<title>Customers · Hollin Nursery</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex flex-col gap-1">
			<h1 class="display-3">Customers</h1>
			<p class="text-[0.9375rem] text-muted-foreground">
				{customerList.length} customers with an account, {tradeCount} of them trade. Trade customers buy in bulk and get
				an invoice.
			</p>
		</div>
		<div class="w-full sm:max-w-72">
			<InputGroup.Root class="h-10">
				<InputGroup.Addon>
					<SearchIcon aria-hidden="true" />
				</InputGroup.Addon>
				<InputGroup.Input
					type="search"
					aria-label="Search customers by name or town"
					placeholder="Name or town"
					autocomplete="off"
					bind:value={search}
				/>
			</InputGroup.Root>
		</div>
	</div>

	{#if rows.length > 0}
		<Table.Root aria-label="Customers" class="border-t">
			<Table.Header>
				<Table.Row class="hover:bg-transparent">
					<Table.Head>Customer</Table.Head>
					<Table.Head>Address</Table.Head>
					<Table.Head>Phone</Table.Head>
					<Table.Head class="text-right">October orders</Table.Head>
					<Table.Head class="text-right">Spent</Table.Head>
					<Table.Head>In progress</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rows as c (c.id)}
					{@const s = stats[c.id]}
					<Table.Row>
						<Table.Cell class="py-2.5">
							<div class="flex items-center gap-3">
								<Avatar.Root size="sm">
									<Avatar.Fallback>{c.initials}</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex min-w-0 flex-col">
									<span class="flex items-center gap-2 font-display font-bold">
										{c.name}
										{#if c.trade}<Badge variant="outline">Trade</Badge>{/if}
									</span>
									<a href="mailto:{c.email}" class="w-fit rounded-xs text-sm text-muted-foreground outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/60">
										{c.email}
									</a>
								</div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<span class="block">{c.street}</span>
							<span class="block text-sm text-muted-foreground">{c.town}, {hollin.address.state} {c.zip}</span>
						</Table.Cell>
						<Table.Cell class={['whitespace-nowrap', !c.phone && 'text-muted-foreground']}>{c.phone ?? 'None'}</Table.Cell>
						<Table.Cell class="text-right">{s.orders}</Table.Cell>
						<Table.Cell class="text-right">{formatMoney(s.spend)}</Table.Cell>
						<Table.Cell>
							{#if s.inProgress > 0}
								<a href="/dashboard/orders?q={encodeURIComponent(c.name)}" class="text-link text-sm whitespace-nowrap">
									{s.inProgress} {s.inProgress === 1 ? 'order' : 'orders'}
								</a>
							{:else}
								<span class="text-muted-foreground">None</span>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<Empty.Root class="rounded-none border-t py-12 md:py-14">
			<Empty.Header>
				<Empty.Title>No customers match “{search.trim()}”</Empty.Title>
				<Empty.Description>Search looks at names and towns. Walk-in buyers without an account are not listed.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm" onclick={() => (search = '')}>Clear search</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
</div>
