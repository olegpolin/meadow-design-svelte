<script lang="ts">
	import { page } from '$app/state';
	import SearchIcon from '@lucide/svelte/icons/search';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import StockBadge from '#lib/components/dashboard/stock-badge.svelte';
	import AddPlantDialog from '#lib/components/dashboard/add-plant-dialog.svelte';
	import { formatDate, formatMoney, stockState, type PlantCategory } from '#lib/demos/world.js';
	import { categories } from '#lib/components/dashboard/data.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	const categoryItems = [
		{ value: 'all', label: 'All categories' },
		...categories.map((c) => ({ value: c, label: c }))
	];

	/* The top bar search lands here as ?q=. */
	let search = $derived(page.url.searchParams.get('q') ?? '');
	let category = $state('all');
	let justAdded = $state<string | null>(null);

	const rows = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return shop
			.plantsIn(category as PlantCategory | 'all')
			.filter((p) => !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
	});

	const counts = $derived({
		low: shop.plants.filter((p) => stockState(p) === 'Low').length,
		soldOut: shop.plants.filter((p) => stockState(p) === 'Sold out').length,
		preorder: shop.plants.filter((p) => stockState(p) === 'Pre-order').length
	});

	function clearFilters() {
		search = '';
		category = 'all';
	}
</script>

<svelte:head>
	<title>Plants · Hollin Nursery</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex flex-col gap-1">
			<h1 class="display-3">Plants</h1>
			<p class="text-[0.9375rem] text-muted-foreground tabular-nums">
				{shop.plants.length} lines on the list. {counts.low} running low, {counts.soldOut} sold out,
				{counts.preorder} on pre-order for the November bare-root deliveries.
			</p>
		</div>
		<AddPlantDialog
			onAdded={(id) => {
				clearFilters();
				justAdded = id;
			}}
		/>
	</div>

	<div class="flex flex-col gap-3 sm:flex-row">
		<InputGroup.Root class="h-10 sm:max-w-72">
			<InputGroup.Addon>
				<SearchIcon aria-hidden="true" />
			</InputGroup.Addon>
			<InputGroup.Input
				type="search"
				aria-label="Search plants by name or location"
				placeholder="Plant or location"
				autocomplete="off"
				bind:value={search}
			/>
		</InputGroup.Root>
		<Select.Root type="single" items={categoryItems} bind:value={category}>
			<Select.Trigger size="sm" class="w-full sm:w-60" aria-label="Category">
				<Select.Value placeholder="All categories" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each categoryItems as c (c.value)}
						<Select.Item value={c.value} label={c.label} />
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	{#if rows.length > 0}
		<Table.Root aria-label="Stock" class="border-t">
			<Table.Header>
				<Table.Row class="hover:bg-transparent">
					<Table.Head>Plant</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head>Where</Table.Head>
					<Table.Head class="text-right">In stock</Table.Head>
					<Table.Head class="text-right">Reserved</Table.Head>
					<Table.Head class="text-right">Price</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rows as plant (plant.id)}
					<Table.Row data-state={plant.id === justAdded ? 'selected' : undefined}>
						<Table.Cell class="py-2.5">
							<span class="block font-display font-bold">{plant.name}</span>
							<span class="block text-sm text-muted-foreground">{plant.form}</span>
						</Table.Cell>
						<Table.Cell>{plant.category}</Table.Cell>
						<Table.Cell>{plant.location}</Table.Cell>
						<Table.Cell class="text-right">
							{#if stockState(plant) === 'Pre-order'}
								<span class="whitespace-nowrap text-muted-foreground">Due {formatDate(plant.arrives!)}</span>
							{:else}
								{plant.stock}
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right">{plant.reserved}</Table.Cell>
						<Table.Cell class="text-right">{formatMoney(plant.price)}</Table.Cell>
						<Table.Cell><StockBadge {plant} /></Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<p class="text-sm text-muted-foreground tabular-nums">
			Showing {rows.length} of {shop.plants.length}. Reserved plants are held for open orders and pre-orders.
		</p>
	{:else}
		<Empty.Root class="rounded-none border-t py-12 md:py-14">
			<Empty.Header>
				<Empty.Title>
					{search.trim() ? `No plants match “${search.trim()}”` : `Nothing in ${category} yet`}
				</Empty.Title>
				<Empty.Description>
					Search looks at plant names and where they are. Try the variety name on its own, or add it as a new plant.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm" onclick={clearFilters}>Clear search and filter</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
</div>
