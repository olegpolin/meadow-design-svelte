<script lang="ts">
	import { tick } from 'svelte';
	import {
		CalendarDate,
		DateFormatter,
		getDayOfWeek,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { Section, Demo } from '#lib/components/showcase/index.js';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import { RangeCalendar } from '#lib/components/ui/range-calendar/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { cn } from '#lib/utils.js';
	import {
		TODAY,
		delivery,
		formatLongDate,
		formatMoney,
		order,
		orderSummary,
		orderTotal,
		plantList,
		plants,
		shortcuts,
		stockBadge,
		stockState
	} from '#lib/demos/world.js';

	const tz = getLocalTimeZone();
	const long = new DateFormatter('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	const short = new DateFormatter('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	const full = new DateFormatter('en-US', { dateStyle: 'medium' });
	const fmt = (f: DateFormatter, d: DateValue) => f.format(d.toDate(tz));

	const toCalendarDate = (iso: string) => {
		const [y, m, d] = iso.split('-').map(Number);
		return new CalendarDate(y, m, d);
	};
	const todayDate = toCalendarDate(TODAY);
	const keys = (s: { keys: readonly string[] }) => s.keys.join(' ');

	/* ------------------------------------------------------------ Combobox */
	// Order #4479 is two hellebores; the combobox picks its plant.
	const comboOrder = order('#4479');
	const comboPlants = plantList.map((p) => ({ plant: p, state: stockState(p) }));

	let plantOpen = $state(false);
	let plantValue = $state<string>(comboOrder.lines[0].plant.id);
	let plantTrigger = $state<HTMLButtonElement | null>(null);
	const picked = $derived(comboPlants.find((p) => p.plant.id === plantValue));

	function choosePlant(value: string) {
		plantValue = value;
		plantOpen = false;
		// Hand focus back to the trigger once the popover has closed.
		tick().then(() => plantTrigger?.focus());
	}

	/* ------------------------------------------------------------- Command */
	const paletteOrders = ['#4471', '#4479', '#4483'].map(order);
	const palettePlants = [plants.witchHazel, plants.lavender, plants.seaHolly];
	let ran = $state('');
	let paletteOpen = $state(false);
	let paletteRan = $state('');

	function runFromPalette(label: string) {
		paletteRan = label;
		paletteOpen = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key.toLowerCase() === shortcuts.search.keys[1].toLowerCase()) {
			e.preventDefault();
			paletteOpen = !paletteOpen;
		}
	}

	/* ------------------------------------------------------------ Calendar */
	// The shop is closed on Mondays, and past days can't be booked.
	const weekday = (d: DateValue) => getDayOfWeek(d, 'en-US');
	const collectionClosed = (d: DateValue) => weekday(d) === 1 || d.compare(todayDate) < 0;
	// Rosa collects order #4481 from the yard gate.
	const collectionOrder = order('#4481');
	let pickup = $state<DateValue | undefined>(toCalendarDate(collectionOrder.due!));
	let customerSince = $state<DateValue | undefined>(new CalendarDate(2023, 9, 12));

	/* ------------------------------------------------------ Range calendar */
	// Van runs go out on Tuesday, Thursday and Saturday.
	const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const runWeekdays: number[] = delivery.days.map((day) => WEEKDAYS.indexOf(day));
	const isRunDay = (d: DateValue) => runWeekdays.includes(weekday(d));
	const listFormat = new Intl.ListFormat('en-US');
	let deliveryWindow = $state<DateRange>({
		start: toCalendarDate(delivery.nextRuns[1]),
		end: new CalendarDate(2026, 10, 31)
	});
	const runsInWindow = $derived.by(() => {
		const { start, end } = deliveryWindow;
		if (!start || !end) return [];
		const days: DateValue[] = [];
		for (let d: DateValue = start; d.compare(end) <= 0; d = d.add({ days: 1 })) {
			if (isRunDay(d)) days.push(d);
		}
		return days;
	});

	/* --------------------------------------------------------- Date picker */
	// Order #4471: Hal's roses land on November 10; deliver on a run after that.
	const roseOrder = order('#4471');
	const roseArrival = toCalendarDate(plants.rose.arrives);
	const roseSlot = delivery.slots.find((s) => s.id === roseOrder.slot)!;
	const notARunAfterArrival = (d: DateValue) => !isRunDay(d) || d.compare(roseArrival) <= 0;
	let deliveryOpen = $state(false);
	let deliveryDate = $state<DateValue | undefined>(toCalendarDate(roseOrder.due!));
</script>

<svelte:window {onkeydown} />

{#snippet paletteItems(run: (label: string) => void)}
	<Command.Input placeholder="Search orders, plants and actions" />
	<Command.List>
		<Command.Empty>Nothing matches. Try an order number like 4471 or a plant name.</Command.Empty>
		<Command.Group heading="Orders">
			{#each paletteOrders as o (o.id)}
				<Command.Item value="Order {o.id} {o.customer.name}" onSelect={() => run(`Order ${o.id}`)}>
					<span>Order {o.id}</span>
					<span class="min-w-0 truncate text-muted-foreground">{o.customer.name}</span>
					<Command.Shortcut>{formatMoney(orderTotal(o))}</Command.Shortcut>
				</Command.Item>
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Plants">
			{#each palettePlants as p (p.id)}
				<Command.Item value={p.name} keywords={[p.id]} onSelect={() => run(p.name)}>{p.name}</Command.Item>
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Actions">
			<Command.Item value={shortcuts.newOrder.label} onSelect={() => run(shortcuts.newOrder.label)}>
				{shortcuts.newOrder.label}
				<Command.Shortcut>{keys(shortcuts.newOrder)}</Command.Shortcut>
			</Command.Item>
			<Command.Item value={shortcuts.print.label} onSelect={() => run(shortcuts.print.label)}>
				{shortcuts.print.label}
				<Command.Shortcut>{keys(shortcuts.print)}</Command.Shortcut>
			</Command.Item>
			<Command.Item value="Email June about invoices" disabled>
				Email June about invoices
			</Command.Item>
		</Command.Group>
	</Command.List>
{/snippet}

<Section
	id="combobox"
	title="Combobox"
	description="Choose one value from a list too long to scan, by typing a few letters of it."
>
	<Demo label="Plant for order {comboOrder.id}" tone="warm" layout="stack">
		<Popover.Root bind:open={plantOpen}>
			<Popover.Trigger
				bind:ref={plantTrigger}
				role="combobox"
				aria-expanded={plantOpen}
				aria-label="Plant"
				class={cn(buttonVariants({ variant: 'outline' }), 'w-72 max-w-full justify-between px-5')}
			>
				<span class={cn('truncate', !picked && 'opacity-70')}>{picked?.plant.name ?? 'Choose a plant'}</span>
				<ChevronsUpDownIcon class="opacity-70" aria-hidden="true" />
			</Popover.Trigger>
			<Popover.Content class="w-80 max-w-[calc(100vw-2.5rem)] p-0" align="start">
				<Command.Root>
					<Command.Input placeholder="Search the nursery" />
					<Command.List>
						<Command.Empty>No plant by that name. Tomasz can check the back beds.</Command.Empty>
						<Command.Group heading="In the nursery">
							{#each comboPlants as { plant: p, state } (p.id)}
								<Command.Item
									value={p.name}
									keywords={[p.id]}
									disabled={state === 'Sold out'}
									data-checked={p.id === plantValue}
									onSelect={() => choosePlant(p.id)}
								>
									<span class="min-w-0 flex-1 truncate">{p.name}</span>
									<span class="text-sm text-muted-foreground tabular-nums">
										{state === 'Sold out' || state === 'Pre-order' ? state : formatMoney(p.price)}
									</span>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		{#if picked}
			<p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
				<Badge variant={stockBadge[picked.state]}>{picked.state}</Badge>
				{#if picked.state === 'Pre-order' && picked.plant.arrives}
					{formatMoney(picked.plant.price)} each. Arrives {formatLongDate(picked.plant.arrives)}, {picked.plant.reserved} reserved so far.
				{:else}
					{picked.plant.stock} in stock, {picked.plant.reserved} reserved, {formatMoney(picked.plant.price)} each.
				{/if}
			</p>
		{/if}
	</Demo>
</Section>

<Section
	id="command"
	title="Command"
	description="Search orders, plants and actions from one box, and run them from the keyboard."
>
	<Demo label="Inline" tone="cool" layout="stack">
		<Command.Root class="max-w-md">
			{@render paletteItems((label) => (ran = label))}
		</Command.Root>
		<p class="text-sm" aria-live="polite">
			{ran ? `Opened: ${ran}.` : 'Pick a row, or use the arrow keys and Enter.'}
		</p>
	</Demo>
	<Demo label="In a dialog" layout="stack">
		<div class="flex flex-wrap items-center gap-4">
			<button
				type="button"
				class={buttonVariants({ variant: 'outline' })}
				onclick={() => (paletteOpen = true)}
			>
				<SearchIcon data-icon="inline-start" aria-hidden="true" />
				Search the shop
			</button>
			<p class="flex items-center gap-2 text-sm text-muted-foreground">
				or press
				<Kbd.Group>
					{#each shortcuts.search.keys as key (key)}
						<Kbd.Root>{key}</Kbd.Root>
					{/each}
				</Kbd.Group>
			</p>
		</div>
		{#if paletteRan}
			<p class="text-sm" aria-live="polite">Opened: {paletteRan}.</p>
		{/if}
		<Command.Dialog
			bind:open={paletteOpen}
			title="Search Hollin Nursery"
			description="Find an order, a plant or an action."
		>
			{@render paletteItems(runFromPalette)}
		</Command.Dialog>
	</Demo>
</Section>

<Section
	id="calendar"
	title="Calendar"
	description="Pick one day from a month grid, with days that can't be booked crossed out."
>
	<Demo label="Collection day" layout="stack">
		<Calendar type="single" bind:value={pickup} isDateUnavailable={collectionClosed} />
		<p class="text-sm" aria-live="polite">
			{pickup
				? `${collectionOrder.customer.name} collects order ${collectionOrder.id} from the yard gate on ${fmt(long, pickup)}. We’re closed on Mondays.`
				: 'No collection day yet. We’re closed on Mondays.'}
		</p>
	</Demo>
	<Demo label="Month and year menus" tone="warm" layout="stack">
		<Calendar type="single" bind:value={customerSince} captionLayout="dropdown" />
		<p class="text-sm" aria-live="polite">
			{customerSince
				? `${roseOrder.customer.name} has been a customer since ${fmt(full, customerSince)}.`
				: `When did ${roseOrder.customer.name} first order?`}
		</p>
	</Demo>
</Section>

<Section
	id="range-calendar"
	title="Range calendar"
	description="Pick a first and last day, such as the days a delivery can arrive."
>
	<Demo label="Delivery window" tone="warm" layout="stack">
		<RangeCalendar bind:value={deliveryWindow} />
		<p class="text-sm" aria-live="polite">
			{#if deliveryWindow.start && deliveryWindow.end}
				{#if runsInWindow.length}
					{runsInWindow.length === 1 ? '1 van run' : `${runsInWindow.length} van runs`} in that window, the first on
					{fmt(long, runsInWindow[0])}.
				{:else}
					No van runs in that window. Runs go out on {listFormat.format(delivery.days)}.
				{/if}
			{:else if deliveryWindow.start}
				From {fmt(short, deliveryWindow.start)}. Now pick the last day.
			{:else}
				Pick the first day Priya can deliver.
			{/if}
		</p>
	</Demo>
</Section>

<Section
	id="date-picker"
	title="Date picker"
	description="A calendar behind a button, for forms where the date is one field among many."
>
	<Demo label="Delivery date for order {roseOrder.id}" tone="cool" layout="stack">
		<Popover.Root bind:open={deliveryOpen}>
			<Popover.Trigger
				class={cn(buttonVariants({ variant: 'outline' }), 'w-72 max-w-full justify-start')}
			>
				<CalendarIcon data-icon="inline-start" aria-hidden="true" />
				<span class={cn('truncate', !deliveryDate && 'opacity-70')}>
					{deliveryDate ? fmt(long, deliveryDate) : 'Pick a run day'}
				</span>
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<Calendar
					type="single"
					bind:value={deliveryDate}
					isDateUnavailable={notARunAfterArrival}
					onValueChange={() => (deliveryOpen = false)}
				/>
			</Popover.Content>
		</Popover.Root>
		<p class="text-sm">
			{roseOrder.customer.name}, {roseOrder.customer.street}. {orderSummary(roseOrder)}, arriving
			{formatLongDate(plants.rose.arrives)}.
			{deliveryDate
				? `Delivery on ${fmt(long, deliveryDate)}, ${roseSlot.label.toLowerCase()}, ${roseSlot.window}.`
				: 'Pick a run day after the roses land.'}
		</p>
	</Demo>
</Section>
