<script lang="ts">
	import { toast } from 'svelte-sonner';
	import SnowflakeIcon from '@lucide/svelte/icons/snowflake';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import DeliveryRun from '#lib/components/dashboard/delivery-run.svelte';
	import TakingsChart from '#lib/components/dashboard/takings-chart.svelte';
	import ReorderDialog from '#lib/components/dashboard/reorder-dialog.svelte';
	import StockBadge from '#lib/components/dashboard/stock-badge.svelte';
	import { TODAY, delivery, formatDate, formatLongDate, formatTime, shop as hollin, stockState, weather } from '#lib/demos/world.js';
	import { TOMORROW, itemCount, supplierName, whenText, type ShopOrder, type ShopPlant } from '#lib/components/dashboard/data.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	let frostHandled = $state(false);
	/* "Frost tonight, down to 27°F" as the title, the advice as the body. */
	const [frostTitle, ...frostRest] = weather.frostWarning.split('. ');
	const frostBody = frostRest.join('. ');

	const driver = delivery.todayRun.driver.name.split(' ')[0];

	/* Due soonest first, so tomorrow's pickup is packed before Saturday's van. */
	const toPack = $derived([...shop.toPack].sort((a, b) => (a.due ?? '').localeCompare(b.due ?? '') || a.id.localeCompare(b.id)));
	/* "tomorrow, Saturday and Tuesday": the days the packing bench is working toward. */
	const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
	const packDays = $derived.by(() => {
		const words = [...new Set(toPack.map((o) => o.due ?? ''))].map((d) =>
			d === TODAY ? 'today' : d === TOMORROW ? 'tomorrow' : weekday.format(new Date(`${d}T12:00:00`))
		);
		return words.length > 1 ? `${words.slice(0, -1).join(', ')} and ${words.at(-1)}` : words[0];
	});
	const packed = $derived(shop.packedNow.map((id) => shop.find(id)).filter((o) => o?.status === 'Packed') as ShopOrder[]);

	function pack(order: ShopOrder) {
		shop.setStatus(order.id, 'Packed');
		toast.success(`${order.id} packed`, {
			description: `${order.customer.name}, ${whenText(order)}.`,
			action: { label: 'Undo', onClick: () => shop.setStatus(order.id, 'Open') }
		});
	}

	function watchText(plant: ShopPlant) {
		if (plant.onOrder) return `${plant.onOrder} on order from ${supplierName(plant.supplier)}`;
		const state = stockState(plant);
		if (state === 'Pre-order') return `Arrives ${formatDate(plant.arrives!)}, ${plant.reserved} reserved`;
		if (state === 'Sold out') return `None left, ${plant.location}`;
		return `${plant.stock} left, ${plant.reserved} reserved, ${plant.location}`;
	}
</script>

<svelte:head>
	<title>Today · {hollin.name}</title>
</svelte:head>

<div class="flex flex-col gap-6 md:gap-8">
	{#if !frostHandled}
		<Alert.Root variant="accent">
			<SnowflakeIcon />
			<Alert.Title>{frostTitle}</Alert.Title>
			<Alert.Description>{frostBody}</Alert.Description>
			<Alert.Action>
				<Button variant="outline" size="xs" onclick={() => (frostHandled = true)}>Done</Button>
			</Alert.Action>
		</Alert.Root>
	{/if}

	<!-- The morning: one warm block holding the run and the packing bench. -->
	<section class="rounded-block bg-secondary p-5 text-secondary-foreground md:p-8" aria-labelledby="today-heading">
		<div class="flex flex-col gap-1">
			<h1 id="today-heading" class="display-3 md:text-4xl">{formatLongDate(TODAY)}</h1>
			<p class="text-[0.9375rem] text-current/80">
				{driver} left with {delivery.todayRun.van} at {formatTime(delivery.todayRun.left)}.
				{toPack.length === 0 ? 'Nothing left to pack.' : `${toPack.length} ${toPack.length === 1 ? 'order' : 'orders'} to pack for ${packDays}.`}
			</p>
		</div>

		<div class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
			<DeliveryRun />

			<div class="flex flex-col gap-4">
				<div class="flex items-baseline justify-between gap-4">
					<h2 id="pack-heading" class="display-4">To pack</h2>
					<a href="/dashboard/orders" class="text-link text-sm">All orders</a>
				</div>

				{#if toPack.length > 0}
					<Item.Group class="border-t border-current" aria-labelledby="pack-heading">
						{#each toPack as order (order.id)}
							<Item.Root size="sm" class="px-0" role="listitem">
								<Item.Content class="min-w-0">
									<Item.Title class="w-full truncate">
										<a href="/dashboard/orders?order={order.id.slice(1)}" class="text-link font-bold no-underline hover:underline">
											{order.id}
										</a>
										<span class="truncate font-medium">{order.customer.name}</span>
									</Item.Title>
									<Item.Description class="text-current/75">
										{itemCount(order)}, {whenText(order)}
									</Item.Description>
								</Item.Content>
								<Item.Actions>
									<Button variant="outline" size="xs" onclick={() => pack(order)}>
										Mark packed<span class="sr-only">&nbsp;{order.id}</span>
									</Button>
								</Item.Actions>
							</Item.Root>
						{/each}
					</Item.Group>
				{:else}
					<p class="border-t border-current pt-4 text-[0.9375rem]">
						The bench is clear. New orders land here as they come in.
					</p>
				{/if}

				{#if packed.length > 0}
					<div class="mt-2 flex flex-col gap-2">
						<h3 id="packed-heading" class="font-display text-sm font-bold">Packed this morning</h3>
						<Item.Group class="border-t border-current/40 divide-current/40" aria-labelledby="packed-heading">
							{#each packed as order (order.id)}
								<Item.Root size="xs" class="px-0" role="listitem">
									<Item.Content class="min-w-0">
										<Item.Title class="w-full truncate font-medium">
											<span class="font-bold">{order.id}</span>
											{order.customer.name}
										</Item.Title>
									</Item.Content>
									<Item.Actions>
										<Button variant="ghost" size="xs" onclick={() => shop.setStatus(order.id, 'Open')}>
											Undo<span class="sr-only">&nbsp;packing {order.id}</span>
										</Button>
									</Item.Actions>
								</Item.Root>
							{/each}
						</Item.Group>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<div class="mt-2 grid gap-10 lg:grid-cols-12 lg:gap-12">
		<div class="min-w-0 lg:col-span-7">
			<TakingsChart />
		</div>

		<section aria-labelledby="low-heading" class="flex min-w-0 flex-col gap-4 lg:col-span-5">
			<div class="flex items-baseline justify-between gap-4">
				<h2 id="low-heading" class="display-4">Stock to watch</h2>
				<a href="/dashboard/plants" class="text-link text-sm">All plants</a>
			</div>
			<Item.Group class="border-t" aria-labelledby="low-heading">
				{#each shop.watchList as plant (plant.id)}
					<Item.Root size="sm" class="px-0" role="listitem">
						<Item.Content class="min-w-0">
							<Item.Title class="w-full">
								<span class="truncate">{plant.name}</span>
								<StockBadge {plant} />
							</Item.Title>
							<Item.Description class="tabular-nums">
								{watchText(plant)}
							</Item.Description>
						</Item.Content>
						{#if !plant.onOrder && stockState(plant) !== 'Pre-order'}
							<Item.Actions>
								<ReorderDialog {plant} />
							</Item.Actions>
						{/if}
					</Item.Root>
				{/each}
			</Item.Group>
		</section>
	</div>
</div>
