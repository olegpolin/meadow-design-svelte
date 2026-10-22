<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import SendIcon from '@lucide/svelte/icons/send';
	import SnowflakeIcon from '@lucide/svelte/icons/snowflake';
	import StarIcon from '@lucide/svelte/icons/star';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import StrikethroughIcon from '@lucide/svelte/icons/strikethrough';
	import { CatalogPage, Section, Demo } from '#lib/components/showcase/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as ButtonGroup from '#lib/components/ui/button-group/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import {
		TODAY,
		delivery,
		formatLongDate,
		formatMoney,
		formatDate,
		formatTime,
		octoberRuns,
		order,
		orderSummary,
		orderTotal,
		orders,
		plantList,
		plants,
		shortcuts,
		statusBadge,
		stockState,
		type Order,
		type OrderStatus
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'button', title: 'Button' },
		{ id: 'button-group', title: 'Button group' },
		{ id: 'toggle', title: 'Toggle' },
		{ id: 'toggle-group', title: 'Toggle group' },
		{ id: 'badge', title: 'Badge' },
		{ id: 'kbd', title: 'Kbd' }
	];

	/* Demo links stay on the page. */
	const stay = (event: MouseEvent) => event.preventDefault();

	const listJoin = (items: string[]) =>
		items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

	const isPreOrder = (o: Order) => o.lines.some((l) => l.plant.arrives);
	const openOrders = orders.filter((o) => o.status === 'Open');
	const toPack = openOrders.filter((o) => !isPreOrder(o)).length;
	const preOrders = openOrders.filter(isPreOrder).length;

	/* Button: a send action with a real loading and done state. */
	const run = delivery.todayRun;
	let sendState = $state<'idle' | 'sending' | 'sent'>('idle');
	function sendRoute() {
		sendState = 'sending';
		setTimeout(() => (sendState = 'sent'), 1400);
	}

	const driverFirstName = run.driver.name.split(' ')[0];
	const marguerite = order('#4479');
	const rosaCollection = order('#4481');
	const devOrder = order('#4480');

	/* "due Tue, Oct 27", "collecting Fri, Oct 23" */
	const dueLine = (o: Order) =>
		o.due ? `${o.fulfilment === 'collection' ? 'collecting' : 'due'} ${formatDate(o.due)}` : 'no date yet';

	/* Button group: pack an order, print its slip. */
	let packed = $state(false);
	let slipsPrinted = $state(0);

	/* Button group: quantity stepper, capped at what is not already reserved. */
	const stepperPlant = plants.witchHazel;
	const available = stepperPlant.stock - stepperPlant.reserved;
	let quantity = $state(2);

	/* Button group: step through the open orders. */
	let orderIndex = $state(openOrders.findIndex((o) => o.id === '#4479'));
	const current = $derived(openOrders[orderIndex]);

	/* Button group on the ink card: a refund on a delivered order. */
	const refundOrder = order('#4470');
	const refundLine = refundOrder.lines.find((l) => l.plant.id === plants.hellebore.id)!;
	let refund = $state<'pending' | 'approved' | 'held' | 'declined'>('pending');

	/* Toggle */
	let watching = $state(true);
	let frostAlerts = $state(false);
	let labelBold = $state(true);
	let labelItalic = $state(false);
	let labelUnderline = $state(false);

	/* Toggle group: delivery calendar view. */
	let view = $state('day');
	const weekRuns = octoberRuns.filter((r) => r.date >= '2026-10-19');
	const saturdayBooked = orders.filter((o) => o.fulfilment === 'delivery' && o.due === delivery.nextRuns[0]).length;
	const monthStops = octoberRuns.reduce((sum, r) => sum + r.stops, 0) + run.stops;
	const viewSummary: Record<string, string> = {
		day: `${formatLongDate(TODAY)}: ${driverFirstName} is out in ${run.van} with ${run.stops} stops. She left at ${formatTime(run.left)}.`,
		week: `This week so far: ${weekRuns.reduce((sum, r) => sum + r.stops, 0) + run.stops} stops on ${weekRuns.length + 1} runs. ${saturdayBooked} orders booked for ${formatLongDate(delivery.nextRuns[0])}.`,
		month: `October so far: ${octoberRuns.length + 1} runs, ${monthStops} stops.`
	};

	/* Toggle group: stock filter by category. */
	const categories = [...new Set(plantList.map((p) => p.category))];
	let stockFilter = $state<string[]>(['Perennials', 'Shrubs']);
	const stockSummary = $derived.by(() => {
		const shown = plantList.filter((p) => stockFilter.includes(p.category));
		const inStock = shown.filter((p) => p.stock > 0);
		const units = inStock.reduce((sum, p) => sum + p.stock, 0);
		const onPreOrder = shown.filter((p) => stockState(p) === 'Pre-order').length;
		const stock = inStock.length === 0 ? 'Nothing in stock' : `${units} in stock across ${inStock.length} ${inStock.length === 1 ? 'listing' : 'listings'}`;
		return onPreOrder > 0 ? `${stock}, plus ${onPreOrder} on pre-order.` : `${stock}.`;
	});

	/* Toggle group: van run days, out of the days the shop is open. */
	const openDays = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	let runDays = $state<string[]>([...delivery.days]);

	/* Toggle group on the ink card. */
	let inkView = $state('week');
	let coolSort = $state('newest');

	/* Badge: one row per status, from the ledger. */
	const statuses = Object.keys(statusBadge) as OrderStatus[];
	const badgeRows = ['#4479', '#4476', '#4474', '#4472', '#4469'].map(order);
</script>

<CatalogPage group="actions" {sections}>
	<!-- Button ------------------------------------------------------------ -->
	<Section id="button" title="Button" description="Use a button for anything that does something: save, send, print, delete. One filled button per view.">
		<Demo label="Variants">
			<Button>Place order</Button>
			<Button variant="secondary">Save draft</Button>
			<Button variant="outline">Print label</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="destructive">Delete order</Button>
			<Button variant="link" href="/components/actions#button" onclick={stay}>View invoice</Button>
		</Demo>

		<Demo label="Sizes">
			<Button size="xs">Add</Button>
			<Button size="sm">Add to basket</Button>
			<Button>Add to basket</Button>
			<Button size="lg">Add to basket</Button>
			<Button size="icon-sm" variant="outline" aria-label="Add one more">
				<PlusIcon />
			</Button>
			<Button size="icon" variant="outline" aria-label="Add one more">
				<PlusIcon />
			</Button>
			<Button size="icon-lg" variant="outline" aria-label="Add one more">
				<PlusIcon />
			</Button>
		</Demo>

		<Demo label="With icons and a loading state">
			<Button>
				<PlusIcon data-icon="inline-start" />
				Add plant
			</Button>
			<Button variant="outline">
				<DownloadIcon data-icon="inline-start" />
				Export stock list
			</Button>
			<Button variant="secondary">
				Next week
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
			<Button onclick={sendRoute} disabled={sendState === 'sending'} aria-live="polite">
				{#if sendState === 'sending'}
					<Spinner data-icon="inline-start" aria-hidden="true" />
					Sending
				{:else if sendState === 'sent'}
					<CheckIcon data-icon="inline-start" />
					Sent to {driverFirstName}
				{:else}
					<SendIcon data-icon="inline-start" />
					Send route to {driverFirstName}
				{/if}
			</Button>
		</Demo>

		<Demo label="As links and disabled">
			<Button href="/components/forms" variant="outline">
				Open the forms page
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
			<Button href="/dashboard" variant="ghost">Go to the dashboard</Button>
			<Button disabled>Refund {formatMoney(orderTotal(marguerite))}</Button>
			<Button variant="outline" disabled>Print label</Button>
		</Demo>

		<Demo label="On the warm block" tone="warm">
			<Button>Reserve 3 hellebores</Button>
			<Button variant="outline">Ask Tomasz</Button>
			<Button variant="ghost">Not now</Button>
		</Demo>

		<Demo label="On the cool block" tone="cool">
			<Button>Book a delivery slot</Button>
			<Button variant="outline">See the route</Button>
			<Button variant="link" href="/components/actions#button" onclick={stay}>Delivery terms</Button>
		</Demo>

		<Demo label="On the ink card" tone="ink">
			<Button variant="secondary">Take {formatMoney(orderTotal(rosaCollection))}</Button>
			<Button variant="outline">Split the payment</Button>
			<Button variant="ghost">Back to basket</Button>
		</Demo>
	</Section>

	<!-- Button group ------------------------------------------------------- -->
	<Section
		id="button-group"
		title="Button group"
		description="Join buttons that act on the same thing into one pill. For picking one of several options, use a toggle group."
	>
		<Demo label="Main action with a second one" layout="stack">
			<ButtonGroup.Root aria-label="Order {marguerite.id}">
				<Button onclick={() => (packed = !packed)}>
					{#if packed}
						<CheckIcon data-icon="inline-start" />
						Packed
					{:else}
						Mark as packed
					{/if}
				</Button>
				<Button size="icon" aria-label="Print packing slip" onclick={() => slipsPrinted++}>
					<PrinterIcon />
				</Button>
			</ButtonGroup.Root>
			<p class="text-sm text-muted-foreground" aria-live="polite">
				Order {marguerite.id} for {marguerite.customer.name} is {packed ? 'packed' : 'not packed yet'}.
				{#if slipsPrinted > 0}
					Packing slip sent to the shed printer{slipsPrinted > 1 ? ` (${slipsPrinted} copies)` : ''}.
				{/if}
			</p>
		</Demo>

		<Demo label="Stepper with a value" layout="stack">
			<div class="flex flex-wrap items-center gap-x-5 gap-y-3">
				<ButtonGroup.Root aria-label="Quantity of {stepperPlant.name}, {stepperPlant.form}">
					<Button
						variant="outline"
						size="icon"
						aria-label="One fewer"
						disabled={quantity <= 1}
						onclick={() => quantity--}
					>
						<MinusIcon />
					</Button>
					<ButtonGroup.Text class="min-w-14 justify-center" aria-live="polite">{quantity}</ButtonGroup.Text>
					<Button
						variant="outline"
						size="icon"
						aria-label="One more"
						disabled={quantity >= available}
						onclick={() => quantity++}
					>
						<PlusIcon />
					</Button>
				</ButtonGroup.Root>
				<div class="text-sm">
					<p class="font-display font-bold">{stepperPlant.name}, {stepperPlant.form}</p>
					<p class="text-muted-foreground tabular-nums">
						{formatMoney(stepperPlant.price)} each, {formatMoney(stepperPlant.price * quantity)} total.
						{quantity >= available
							? `That is all ${available} we have free.`
							: `${available - quantity} more free in the ${stepperPlant.location.toLowerCase()}.`}
					</p>
				</div>
			</div>
		</Demo>

		<Demo label="Pager" layout="stack">
			<ButtonGroup.Root aria-label="Open orders">
				<Button
					variant="outline"
					size="icon"
					aria-label="Previous order"
					disabled={orderIndex === 0}
					onclick={() => orderIndex--}
				>
					<ChevronLeftIcon />
				</Button>
				<ButtonGroup.Text>
					{current.id}
					<span class="font-sans font-medium">{orderIndex + 1} of {openOrders.length}</span>
				</ButtonGroup.Text>
				<Button
					variant="outline"
					size="icon"
					aria-label="Next order"
					disabled={orderIndex === openOrders.length - 1}
					onclick={() => orderIndex++}
				>
					<ChevronRightIcon />
				</Button>
			</ButtonGroup.Root>
			<p class="text-sm tabular-nums" aria-live="polite">
				<span class="font-display font-bold">{current.customer.name}</span>, {formatMoney(orderTotal(current))}, {dueLine(current)}.
			</p>
		</Demo>

		<Demo label="Filled segments">
			<ButtonGroup.Root aria-label="Stock list">
				<Button>
					<DownloadIcon data-icon="inline-start" />
					Export CSV
				</Button>
				<Button variant="outline">Export PDF</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root aria-label="Plant label">
				<Button variant="secondary">Print</Button>
				<Button variant="outline">Preview</Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="On the cool block" tone="cool">
			<ButtonGroup.Root aria-label="Delivery for order {devOrder.id}">
				<Button variant="outline">Reschedule</Button>
				<Button variant="outline">Email {devOrder.customer.name.split(' ')[0]}</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root aria-label="Route">
				<Button>Start route</Button>
				<Button size="icon" aria-label="Print route sheet">
					<PrinterIcon />
				</Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="On the ink card" tone="ink" layout="stack">
			<p class="text-sm">
				Refund request from {refundOrder.customer.name} on {refundOrder.id}: {formatMoney(refundLine.plant.price)} for one
				{refundLine.plant.name} that arrived with its crown snapped.
			</p>
			<ButtonGroup.Root aria-label="Refund decision">
				<Button variant="outline" onclick={() => (refund = 'approved')}>Approve</Button>
				<Button variant="outline" onclick={() => (refund = 'held')}>Hold</Button>
				<Button variant="outline" onclick={() => (refund = 'declined')}>Decline</Button>
			</ButtonGroup.Root>
			<p class="text-sm" aria-live="polite">
				{#if refund === 'pending'}
					Waiting for June to decide.
				{:else if refund === 'approved'}
					Approved. June will refund {formatMoney(refundLine.plant.price)} to the card Ottilie paid with.
				{:else if refund === 'held'}
					On hold until Tomasz checks the batch in the {refundLine.plant.location.toLowerCase()}.
				{:else}
					Declined. Ottilie gets an email with the reason.
				{/if}
			</p>
		</Demo>

		<Demo label="Vertical">
			<ButtonGroup.Root orientation="vertical" aria-label="Move plant to">
				<Button variant="outline" size="sm">Polytunnel 1</Button>
				<Button variant="outline" size="sm">Polytunnel 2</Button>
				<Button variant="outline" size="sm">Shade house</Button>
			</ButtonGroup.Root>
		</Demo>
	</Section>

	<!-- Toggle ------------------------------------------------------------- -->
	<Section id="toggle" title="Toggle" description="A single on/off button, for a setting that takes effect straight away.">
		<Demo label="Default and outline" layout="stack">
			<div class="flex flex-wrap items-center gap-4">
				<Toggle bind:pressed={watching}>
					<StarIcon data-icon="inline-start" />
					Watch
				</Toggle>
				<Toggle variant="outline" bind:pressed={frostAlerts}>
					<SnowflakeIcon data-icon="inline-start" />
					Frost alerts
				</Toggle>
			</div>
			<p class="text-sm text-muted-foreground" aria-live="polite">
				{watching ? `You will hear when ${plants.hosta.name} is back in stock.` : `Not watching ${plants.hosta.name}.`}
				{frostAlerts ? 'Tomasz gets a text when the forecast drops below 32°F.' : 'Frost alerts are off.'}
			</p>
		</Demo>

		<Demo label="Sizes, on a plant label editor" layout="stack">
			<div class="flex flex-wrap items-center gap-2">
				<Toggle size="sm" variant="outline" bind:pressed={labelBold} aria-label="Bold">
					<BoldIcon />
				</Toggle>
				<Toggle variant="outline" bind:pressed={labelItalic} aria-label="Italic">
					<ItalicIcon />
				</Toggle>
				<Toggle size="lg" variant="outline" bind:pressed={labelUnderline} aria-label="Underline">
					<UnderlineIcon />
				</Toggle>
				<Toggle size="sm" variant="outline" disabled aria-label="Strikethrough, not available on labels">
					<StrikethroughIcon />
				</Toggle>
			</div>
			<p
				class={[
					'text-lg',
					labelBold && 'font-bold',
					labelItalic && 'italic',
					labelUnderline && 'underline decoration-2 underline-offset-4'
				]}
			>
				Digitalis purpurea
			</p>
		</Demo>

		<Demo label="On the warm block" tone="warm">
			<Toggle pressed>Add a care card</Toggle>
			<Toggle>Morning slot</Toggle>
			<Toggle variant="outline" pressed>Leave by the side gate</Toggle>
			<Toggle variant="outline">Text when near</Toggle>
		</Demo>

		<Demo label="On the ink card" tone="ink">
			<Toggle pressed>Add a care card</Toggle>
			<Toggle>Morning slot</Toggle>
			<Toggle variant="outline" pressed>Leave by the side gate</Toggle>
			<Toggle variant="outline">Text when near</Toggle>
		</Demo>
	</Section>

	<!-- Toggle group ------------------------------------------------------- -->
	<Section
		id="toggle-group"
		title="Toggle group"
		description="Two to six options shown side by side. Joined into one pill for a single choice, separate pills when several can be on."
	>
		<Demo label="Segmented, one choice" layout="stack">
			<ToggleGroup.Root type="single" bind:value={() => view, (v) => v && (view = v)} aria-label="Delivery calendar view">
				<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<p class="text-sm tabular-nums" aria-live="polite">{viewSummary[view]}</p>
		</Demo>

		<Demo label="Outline, several choices" layout="stack">
			<ToggleGroup.Root type="multiple" variant="outline" bind:value={stockFilter} class="flex-wrap" aria-label="Plant categories">
				{#each categories as category (category)}
					<ToggleGroup.Item value={category}>{category}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
			<p class="text-sm tabular-nums" aria-live="polite">
				{#if stockFilter.length === 0}
					Nothing selected. Pick at least one category to see stock.
				{:else}
					{stockSummary}
				{/if}
			</p>
		</Demo>

		<Demo label="Separate pills" layout="stack">
			<ToggleGroup.Root
				type="multiple"
				variant="outline"
				size="sm"
				spacing={2}
				bind:value={runDays}
				class="flex-wrap"
				aria-label="Van run days"
			>
				{#each openDays as day (day)}
					<ToggleGroup.Item value={day} aria-label={day}>{day.slice(0, 3)}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
			<p class="text-sm" aria-live="polite">
				{runDays.length === 0
					? 'No van runs set. Orders will wait for collection at the yard gate.'
					: `The vans go out on ${listJoin(openDays.filter((d) => runDays.includes(d)))}.`}
			</p>
		</Demo>

		<Demo label="On the cool block" tone="cool">
			<ToggleGroup.Root type="single" size="sm" bind:value={() => coolSort, (v) => v && (coolSort = v)} aria-label="Sort orders">
				<ToggleGroup.Item value="newest">Newest</ToggleGroup.Item>
				<ToggleGroup.Item value="oldest">Oldest</ToggleGroup.Item>
				<ToggleGroup.Item value="largest">Largest</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" variant="outline" size="sm" value="all" aria-label="Order status">
				<ToggleGroup.Item value="all">All</ToggleGroup.Item>
				<ToggleGroup.Item value="open">Open</ToggleGroup.Item>
				<ToggleGroup.Item value="packed">Packed</ToggleGroup.Item>
			</ToggleGroup.Root>
		</Demo>

		<Demo label="On the ink card" tone="ink">
			<ToggleGroup.Root type="single" bind:value={() => inkView, (v) => v && (inkView = v)} aria-label="Sales period">
				<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="multiple" variant="outline" value={['Shrubs']} aria-label="Plant categories">
				<ToggleGroup.Item value="Perennials">Perennials</ToggleGroup.Item>
				<ToggleGroup.Item value="Shrubs">Shrubs</ToggleGroup.Item>
			</ToggleGroup.Root>
		</Demo>
	</Section>

	<!-- Badge -------------------------------------------------------------- -->
	<Section id="badge" title="Badge" description="A short status or count next to the thing it describes. One colour per meaning.">
		<Demo label="Order statuses">
			{#each statuses as status (status)}
				<Badge variant={statusBadge[status]}>{status}</Badge>
			{/each}
		</Demo>

		<Demo label="In an order list" layout="block">
			<ul class="border-t">
				{#each badgeRows as row (row.id)}
					<li
						class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b py-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_5.5rem_9rem]"
					>
						<span class="font-display text-sm font-bold tabular-nums">{row.id}</span>
						<span class="justify-self-end sm:order-last">
							<Badge variant={statusBadge[row.status]}>{row.status}</Badge>
						</span>
						<span class="min-w-0 text-sm">
							{row.customer.name}
							<span class="block truncate text-muted-foreground">{orderSummary(row)}</span>
						</span>
						<span class="self-start text-right text-sm tabular-nums sm:self-center">{formatMoney(orderTotal(row))}</span>
					</li>
				{/each}
			</ul>
		</Demo>

		<Demo label="As a count inside a button">
			<Button>
				Orders to pack
				<Badge>{toPack}</Badge>
			</Button>
			<Button variant="outline">
				Pre-orders
				<Badge variant="secondary">{preOrders}</Badge>
			</Button>
		</Demo>

		<Demo label="On the warm block" tone="warm">
			{#each statuses as status (status)}
				<Badge variant={statusBadge[status]}>{status}</Badge>
			{/each}
		</Demo>

		<Demo label="On the ink card" tone="ink">
			{#each statuses as status (status)}
				<Badge variant={statusBadge[status]}>{status}</Badge>
			{/each}
		</Demo>
	</Section>

	<!-- Kbd ---------------------------------------------------------------- -->
	<Section id="kbd" title="Kbd" description="A key or shortcut, shown where people learn it: menus, tooltips, help lists.">
		<Demo label="Shop admin shortcuts" layout="block">
			<dl class="border-t text-sm">
				{#each Object.values(shortcuts) as shortcut (shortcut.label)}
					<div class="flex items-center justify-between gap-4 border-b py-3">
						<dt>{shortcut.label}</dt>
						<dd>{@render keys(shortcut.keys)}</dd>
					</div>
				{/each}
			</dl>
		</Demo>

		<Demo label="Inside buttons">
			<Button variant="outline" size="sm">
				{shortcuts.search.label}
				{@render keys(shortcuts.search.keys)}
			</Button>
			<Button size="sm">
				{shortcuts.save.label}
				{@render keys(shortcuts.save.keys)}
			</Button>
		</Demo>

		<Demo label="On the ink card" tone="ink">
			<p class="flex flex-wrap items-center gap-2 text-sm">
				Press {@render keys(shortcuts.markPacked.keys)} to mark {marguerite.id} packed, or
				{@render keys(shortcuts.print.keys)} to print its label.
			</p>
		</Demo>
	</Section>
</CatalogPage>

{#snippet keys(list: readonly string[])}
	<Kbd.Group>
		{#each list as key (key)}
			<Kbd.Root>{key}</Kbd.Root>
		{/each}
	</Kbd.Group>
{/snippet}
