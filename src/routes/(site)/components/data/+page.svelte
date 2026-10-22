<script lang="ts">
	import { BarChart } from 'layerchart';
	import { CatalogPage, Demo, Section } from '#lib/components/showcase/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Chart from '#lib/components/ui/chart/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import OrdersDataTable from '#lib/components/demos/data/orders-data-table.svelte';
	import {
		deliveryRuns,
		formatDay,
		formatMoney,
		invoiceDelivery,
		invoiceLines,
		invoiceOrder,
		orders,
		statusVariant,
		topPlants,
		weeklySales
	} from '#lib/components/demos/data/hollin-data.js';
	import {
		delivery,
		formatLongDate,
		formatMonthDay,
		orderSubtotal,
		orderTotal,
		plantList,
		stockBadge,
		stockState,
		stockTake
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'table', title: 'Table' },
		{ id: 'data-table', title: 'Data table' },
		{ id: 'chart', title: 'Chart' }
	];

	const recentOrders = orders.slice(-5).reverse();

	/* The invoice: order #4476, two lines, free delivery because it is over the threshold. */
	const invoiceSubtotal = orderSubtotal(invoiceOrder);
	const invoiceTotal = orderTotal(invoiceOrder);
	const invoiceSlot = delivery.slots.find((s) => s.id === invoiceOrder.slot);
	const formatWholeDollars = (n: number) =>
		n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

	/* Charts. Series colours come from --chart-1..5, so they follow the palette and mode. */
	const salesConfig = {
		perennials: { label: 'Perennials', color: 'var(--chart-1)' },
		shrubs: { label: 'Shrubs', color: 'var(--chart-2)' },
		sundries: { label: 'Sundries', color: 'var(--chart-3)' }
	} satisfies Chart.ChartConfig;

	const weekTotals = weeklySales.map((w) => ({ week: w.week, total: w.perennials + w.shrubs + w.sundries }));
	const quietest = weekTotals.reduce((a, b) => (b.total < a.total ? b : a));
	const busiest = weekTotals.reduce((a, b) => (b.total > a.total ? b : a));

	/* On the ink card the series takes the card's text colour. */
	const runsConfig = {
		stops: { label: 'Stops', color: 'currentColor' }
	} satisfies Chart.ChartConfig;

	const totalStops = deliveryRuns.reduce((sum, r) => sum + r.stops, 0);

	/* One entry per plant gives the tooltip its full name (labelKey="plant"); the axis drops the cultivar. */
	const plantsConfig = {
		units: { label: 'Units sold', color: 'var(--chart-1)' },
		...Object.fromEntries(topPlants.map((t) => [t.plant, { label: t.plant }]))
	} satisfies Chart.ChartConfig;
	const withoutCultivar = (name: string) => name.split(' ‘')[0];

	/* Narrow charts show every other date so the labels never touch. */
	let runsWidth = $state(0);

	const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
	const formatShort = (d: Date) => shortDate.format(d);
	const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	const formatThousands = (v: number) => (v === 0 ? '$0' : `$${(v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`);
</script>

<CatalogPage group="data" {sections}>
	<Section
		id="table"
		title="Table"
		description="Rows of records that people compare across columns. Right-align figures so they line up."
	>
		<Demo label="Recent orders" layout="block">
			<!-- The caption sits outside the scrolling container so it stays in view on phones. -->
			<Table.Root aria-labelledby="recent-orders-caption">
				<Table.Header>
					<Table.Row>
						<Table.Head>Order</Table.Head>
						<Table.Head>Customer</Table.Head>
						<Table.Head>Placed</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="text-right">Items</Table.Head>
						<Table.Head class="text-right">Total</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each recentOrders as order (order.id)}
						<Table.Row>
							<Table.Cell class="font-display font-bold">{order.id}</Table.Cell>
							<Table.Cell>{order.customer}</Table.Cell>
							<Table.Cell>{formatDay(order.date)}</Table.Cell>
							<Table.Cell>
								<Badge variant={statusVariant[order.status]}>{order.status}</Badge>
							</Table.Cell>
							<Table.Cell class="text-right">{order.items}</Table.Cell>
							<Table.Cell class="text-right">{formatMoney(order.total)}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<p id="recent-orders-caption" class="mt-4 text-sm text-muted-foreground">
				The five most recent orders, newest first.
			</p>
		</Demo>

		<Demo label="With footer totals" layout="block">
			<Table.Root aria-labelledby="invoice-caption">
				<Table.Header>
					<Table.Row>
						<Table.Head>Item</Table.Head>
						<Table.Head class="text-right">Qty</Table.Head>
						<Table.Head class="text-right">Unit price</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each invoiceLines as line (line.item)}
						<Table.Row>
							<Table.Cell>{line.item}</Table.Cell>
							<Table.Cell class="text-right">{line.qty}</Table.Cell>
							<Table.Cell class="text-right">{formatMoney(line.price)}</Table.Cell>
							<Table.Cell class="text-right">{formatMoney(line.qty * line.price)}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row class="font-sans font-normal">
						<Table.Cell colspan={3}>Subtotal</Table.Cell>
						<Table.Cell class="text-right">{formatMoney(invoiceSubtotal)}</Table.Cell>
					</Table.Row>
					<Table.Row class="font-sans font-normal">
						<Table.Cell colspan={3} class="h-10 pt-0">
							Van delivery, free over {formatWholeDollars(delivery.freeOver)}
						</Table.Cell>
						<Table.Cell class="h-10 pt-0 text-right">
							{invoiceDelivery === 0 ? 'Free' : formatMoney(invoiceDelivery)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell colspan={3}>Total</Table.Cell>
						<Table.Cell class="text-right">{formatMoney(invoiceTotal)}</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
			<p id="invoice-caption" class="mt-4 text-sm text-muted-foreground">
				Order {invoiceOrder.id} for {invoiceOrder.customer.name}: {invoiceOrder.van},
				{formatLongDate(invoiceOrder.due!)}, {invoiceSlot?.window}.
			</p>
		</Demo>

		<Demo label="Stock on the warm block" tone="warm" layout="block">
			<Table.Root aria-labelledby="stock-caption">
				<Table.Header>
					<Table.Row>
						<Table.Head>Plant</Table.Head>
						<Table.Head>Where</Table.Head>
						<Table.Head class="text-right">In stock</Table.Head>
						<Table.Head class="text-right">Reserved</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head>Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each plantList as plant (plant.id)}
						{@const state = stockState(plant)}
						<Table.Row>
							<Table.Cell class="font-display font-bold">{plant.name}</Table.Cell>
							<Table.Cell>{plant.location}</Table.Cell>
							<Table.Cell class="text-right">{plant.stock}</Table.Cell>
							<Table.Cell class="text-right">{plant.reserved}</Table.Cell>
							<Table.Cell class="text-right">{formatMoney(plant.price)}</Table.Cell>
							<Table.Cell>
								<span class="inline-flex items-center gap-2">
									<Badge variant={stockBadge[state]}>{state}</Badge>
									{#if state === 'Pre-order' && plant.arrives}
										<span class="text-sm">Arrives {formatMonthDay(plant.arrives)}</span>
									{/if}
								</span>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<p id="stock-caption" class="mt-4 text-sm">
				From the stock take on {formatLongDate(stockTake.date)}.
				{stockTake.by.name} counted {stockTake.counted.toLocaleString('en-US')} plants in all.
			</p>
		</Demo>
	</Section>

	<Section
		id="data-table"
		title="Data table"
		description="A table people work in: sort by a column, search, select rows and page through. Built with runes state, no table library."
	>
		<Demo label="October orders" layout="block">
			<OrdersDataTable />
		</Demo>
	</Section>

	<Section
		id="chart"
		title="Chart"
		description="LayerChart inside the chart container. Series take the chart tokens, so a single series reads as ink on paper."
	>
		<Demo label="Weekly takings by category" layout="block">
			<Chart.Container config={salesConfig} class="aspect-auto h-72 w-full md:h-80">
				<BarChart
					data={weeklySales}
					x="week"
					seriesLayout="stack"
					stackPadding={2}
					bandPadding={0.3}
					legend
					series={[
						{ key: 'perennials', label: salesConfig.perennials.label, color: salesConfig.perennials.color },
						{ key: 'shrubs', label: salesConfig.shrubs.label, color: salesConfig.shrubs.color },
						{ key: 'sundries', label: salesConfig.sundries.label, color: salesConfig.sundries.color }
					]}
					props={{
						bars: { radius: 8 },
						xAxis: {
							format: (d: Date) => formatShort(d),
							/* Every other week, so the labels never touch. */
							ticks: (scale) => scale.domain().filter((_: Date, i: number) => i % 2 === 0)
						},
						yAxis: { format: (v: number) => formatThousands(v), ticks: 4 },
						/* Wraps inside the card on phones instead of running off the edge. */
						legend: { placement: 'bottom-left', classes: { root: 'right-0', items: 'flex-wrap gap-y-2' } }
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip
							labelFormatter={(d: Date) => `Week of ${formatShort(d)}`}
							valueFormatter={(v) => formatMoney(Number(v))}
						/>
					{/snippet}
				</BarChart>
			</Chart.Container>
			<p class="mt-4 max-w-[38rem] text-sm text-muted-foreground">
				The quietest of the twelve weeks was the week of {formatShort(quietest.week)}, in the heat wave, at
				{formatMoney(quietest.total)}. The best was the week of {formatShort(busiest.week)}, at
				{formatMoney(busiest.total)}.
			</p>
		</Demo>

		<Demo label="Deliveries on the ink card" tone="ink" layout="block">
			<p class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<span class="figure tabular-nums">{totalStops}</span>
				<span class="text-sm">van stops on {deliveryRuns.length} runs in October so far</span>
			</p>
			<div bind:clientWidth={runsWidth} class="mt-6">
				<Chart.Container config={runsConfig} class="aspect-auto h-60 w-full">
					<BarChart
						data={deliveryRuns}
						x="date"
						y="stops"
						bandPadding={0.35}
						series={[{ key: 'stops', label: runsConfig.stops.label, color: runsConfig.stops.color }]}
						props={{
							bars: { radius: 6 },
							xAxis: {
								format: (d: Date) => formatShort(d),
								ticks: (scale) =>
									runsWidth < 480 ? scale.domain().filter((_: Date, i: number) => i % 2 === 0) : scale.domain()
							},
							yAxis: { ticks: 3 }
						}}
					>
						{#snippet tooltip()}
							<Chart.Tooltip labelFormatter={(d: Date) => weekday.format(d)} />
						{/snippet}
					</BarChart>
				</Chart.Container>
			</div>
			<p class="mt-4 max-w-[38rem] text-sm">
				Van stops per run in October. The vans go out on {delivery.days.slice(0, -1).join(', ')} and
				{delivery.days.at(-1)}; today’s run, {delivery.todayRun.stops} stops on {delivery.todayRun.van}, is
				still out.
			</p>
		</Demo>

		<Demo label="Top plants in October" tone="cool" layout="block">
			<Chart.Container config={plantsConfig} class="aspect-auto h-72 w-full">
				<BarChart
					data={topPlants}
					y="plant"
					x="units"
					orientation="horizontal"
					grid={false}
					axis="y"
					bandPadding={0.35}
					padding={{ left: 96, right: 40 }}
					labels={{ placement: 'outside', offset: 8 }}
					series={[{ key: 'units', label: plantsConfig.units.label, color: plantsConfig.units.color, value: 'units' }]}
					props={{ bars: { radius: 8 }, yAxis: { format: (name: string) => withoutCultivar(name) } }}
				>
					{#snippet tooltip()}
						<Chart.Tooltip labelKey="plant" />
					{/snippet}
				</BarChart>
			</Chart.Container>
			<p class="mt-4 max-w-[38rem] text-sm">Units sold so far in October, best first.</p>
		</Demo>
	</Section>
</CatalogPage>
