<script lang="ts">
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import DeliveryRun from '#lib/components/dashboard/delivery-run.svelte';
	import {
		TODAY,
		delivery,
		formatDate,
		formatLongDate,
		formatMoney,
		octoberRuns,
		statusBadge
	} from '#lib/demos/world.js';
	import { itemCount, relativeDay, shortAddress } from '#lib/components/dashboard/data.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	const listFormat = new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' });
	const [van1, van2] = delivery.vans;

	/* The next three runs and the van orders booked on each, by van then slot. */
	const upcoming = $derived(
		delivery.nextRuns.map((day) => ({
			day,
			orders: shop.orders
				.filter((o) => o.fulfilment === 'delivery' && o.due === day && o.status !== 'Cancelled')
				.sort((a, b) => (a.van ?? '').localeCompare(b.van ?? '') || (a.slot ?? '').localeCompare(b.slot ?? '') || a.id.localeCompare(b.id))
		}))
	);

	const vansOn = (orders: { van?: string }[]) => [...new Set(orders.map((o) => o.van).filter(Boolean))].join(' and ');

	const slotLabel = (id?: string) => delivery.slots.find((s) => s.id === id)?.label.toLowerCase() ?? '';

	/* October so far, newest first. */
	const runs = [...octoberRuns].reverse();
	const totalStops = octoberRuns.reduce((sum, r) => sum + r.stops, 0);
</script>

<svelte:head>
	<title>Deliveries · Hollin Nursery</title>
</svelte:head>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-1">
		<h1 class="display-3">Deliveries</h1>
		<p class="max-w-prose text-[0.9375rem] text-muted-foreground">
			The vans go out {listFormat.format(delivery.days)}, within {delivery.radiusMiles} miles. {van1.driver.name} drives
			{van1.name} and {van2.driver.name} drives {van2.name}. Delivery is {formatMoney(delivery.fee)}, free over
			{formatMoney(delivery.freeOver)}.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
		<section aria-label="Today’s run" class="flex flex-col gap-2">
			<p class="text-sm text-muted-foreground">{formatLongDate(TODAY)}</p>
			<DeliveryRun />
		</section>

		<section aria-labelledby="upcoming-heading" class="flex flex-col gap-6">
			<h2 id="upcoming-heading" class="display-4">Next runs</h2>
			{#each upcoming as run (run.day)}
				<div class="flex flex-col gap-1">
					<h3 class="font-display text-sm font-bold">
						{relativeDay(run.day)}{run.orders.length > 0 ? `, ${vansOn(run.orders)}` : ''}
					</h3>
					{#if run.orders.length > 0}
						<Item.Group class="border-t">
							{#each run.orders as order (order.id)}
								<Item.Root size="xs" class="px-0" role="listitem">
									{#snippet child({ props })}
										<a href="/dashboard/orders?order={order.id.slice(1)}" {...props}>
											<Item.Content class="min-w-0">
												<Item.Title class="w-full truncate font-medium">
													<span class="font-bold">{order.id}</span>
													{order.customer.name}
												</Item.Title>
												<Item.Description class="truncate">
													{order.van} {slotLabel(order.slot)}, {itemCount(order)}, {shortAddress(order.customer)}
												</Item.Description>
											</Item.Content>
											<Badge variant={statusBadge[order.status]}>{order.status}</Badge>
										</a>
									{/snippet}
								</Item.Root>
							{/each}
						</Item.Group>
					{:else}
						<p class="border-t pt-3 text-[0.9375rem] text-muted-foreground">
							No orders booked yet. New ones show up here once they are paid.
						</p>
					{/if}
				</div>
			{/each}
		</section>
	</div>

	<section aria-labelledby="past-heading" class="flex flex-col gap-4">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<h2 id="past-heading" class="display-4">October runs so far</h2>
			<p class="text-sm text-muted-foreground tabular-nums">
				{totalStops} stops over {octoberRuns.length} runs
			</p>
		</div>
		<Table.Root aria-labelledby="past-heading" class="border-t">
			<Table.Header>
				<Table.Row class="hover:bg-transparent">
					<Table.Head>Run</Table.Head>
					<Table.Head class="text-right">Stops</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each runs as run (run.date)}
					<Table.Row>
						<Table.Cell class="font-display font-bold">{formatDate(run.date)}</Table.Cell>
						<Table.Cell class="text-right">{run.stops}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
</div>
