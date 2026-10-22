<script lang="ts">
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { CatalogPage, Section, Demo } from '#lib/components/showcase/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import * as Collapsible from '#lib/components/ui/collapsible/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { AspectRatio } from '#lib/components/ui/aspect-ratio/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import * as Resizable from '#lib/components/ui/resizable/index.js';
	import * as Carousel from '#lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '#lib/components/ui/carousel/context.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import {
		TODAY,
		NEXT_ORDER_ID,
		delivery,
		formatDate,
		formatLongDate,
		formatMoney,
		formatTime,
		order,
		orderItems,
		orderSummary,
		orderTotal,
		orders as ledger,
		octoberRuns,
		plants,
		shop,
		staff,
		staffList,
		statusBadge,
		stockBadge,
		stockState,
		weather
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'card', title: 'Card' },
		{ id: 'item', title: 'Item' },
		{ id: 'accordion', title: 'Accordion' },
		{ id: 'collapsible', title: 'Collapsible' },
		{ id: 'separator', title: 'Separator' },
		{ id: 'aspect-ratio', title: 'Aspect ratio' },
		{ id: 'scroll-area', title: 'Scroll area' },
		{ id: 'resizable', title: 'Resizable' },
		{ id: 'carousel', title: 'Carousel' },
		{ id: 'avatar', title: 'Avatar' },
		{ id: 'empty', title: 'Empty' }
	];

	const run = delivery.todayRun;
	const firstName = (name: string) => name.split(' ')[0];

	/* Card: plant card with a quantity stepper. Reserved plants are not for sale. */
	const hellebore = plants.hellebore;
	const available = hellebore.stock - hellebore.reserved;
	let qty = $state(2);

	/* Card: the next three van runs, each with its two slots. Booked counts come from the ledger. */
	const runTones = ['warm', 'cool', 'ink'] as const;
	const runs = delivery.nextRuns.map((date, i) => {
		const onRun = ledger.filter((o) => o.fulfilment === 'delivery' && o.due === date);
		return {
			date,
			tone: runTones[i],
			count: onRun.length,
			slots: delivery.slots.map((slot) => ({
				...slot,
				booked: onRun.filter((o) => o.slot === slot.id).length
			}))
		};
	});
	let bookedSlot = $state<string | null>(null);

	/* Card on the warm block. */
	const smallOrder = order('#4479');

	/* Item: orders placed or due today. */
	const todays = ledger.filter((o) => o.placed === TODAY || o.due === TODAY);
	let selectedOrder = $state('#4474');
	const selected = $derived(todays.find((o) => o.id === selectedOrder));

	/* Collapsible: notes on Hal's rose pre-order. */
	const preorder = order('#4471');
	const preorderNotes = [
		preorder.note ?? '',
		'Leave by the greenhouse if nobody answers.',
		'Dog in the garden. Friendly, but shut the gate.'
	];
	let notesOpen = $state(false);

	/* Separator: today's takings. The till figure is the shop counter; online orders come from the ledger. */
	const placedToday = ledger.filter((o) => o.placed === TODAY);
	const onlineToday = placedToday.reduce((sum, o) => sum + orderTotal(o), 0);
	/* The only refund in the ledger (#4469) went out on October 9. */
	const refundsToday = 0;

	/* Scroll area: delivery log, newest first. */
	const outNow = order('#4474');
	const deliveredOn = (date: string) =>
		ledger.filter((o) => o.status === 'Delivered' && o.fulfilment === 'delivery' && o.due === date);
	const log = [
		{
			t: `${formatDate(TODAY)}, ${formatTime(run.left)}`,
			e: `${firstName(run.driver.name)} left the yard in ${run.van} with ${run.stops} stops. ${outNow.id} for ${outNow.customer.name} is on board.`
		},
		...[...octoberRuns].reverse().map((r) => ({
			t: formatDate(r.date),
			e: [
				`Van run, ${r.stops} stops.`,
				...deliveredOn(r.date).map((o) => `${o.id} delivered to ${o.customer.name}.`)
			].join(' ')
		}))
	];

	/* Resizable: today's orders and one in detail. */
	const outSlot = delivery.slots.find((s) => s.id === outNow.slot);

	/* Carousel: seasonal picks. */
	const picks = [
		{ plant: plants.hellebore, when: 'Flowers December to April', tone: 'warm' },
		{ plant: plants.witchHazel, when: 'Scented flowers in January', tone: 'cool' },
		{ plant: plants.rose, when: `Pre-order, arrives ${formatLongDate(plants.rose.arrives)}`, tone: 'ink' },
		{ plant: plants.apple, when: `Pre-order, arrives ${formatLongDate(plants.apple.arrives)}`, tone: 'paper' },
		{ plant: plants.dogwood, when: 'Bright stems all winter', tone: 'warm' },
		{ plant: plants.seaHolly, when: 'Full sun and poor, free-draining soil', tone: 'cool' }
	] as const;
	let slide = $state(1);
	let slideCount = $state<number>(picks.length);
	/* Embla's own events drive the counter; the carousel cleans up its API on destroy. */
	function connectCarousel(carousel: CarouselAPI | undefined) {
		if (!carousel) return;
		const sync = () => {
			slide = carousel.selectedScrollSnap() + 1;
			slideCount = carousel.scrollSnapList().length;
		};
		sync();
		carousel.on('select', sync);
		carousel.on('reInit', sync);
	}

	/* Avatar: the staff cast. Everyone is in today; Priya is on the van. */
	const shiftNote = (id: string) => (id === staff.priya.id ? `out on ${run.van}` : 'on shift');

	/* Empty: the third run out has nothing booked yet. */
	const emptyRun = delivery.nextRuns[2];
	let emptyRunDrops = $state<{ id: string; who: string; slot: string }[]>([]);
	function bookDelivery() {
		emptyRunDrops = [{ id: NEXT_ORDER_ID, who: 'new order', slot: delivery.slots[0].window }];
	}
	const noteOrder = order('#4483');
	let orderNote = $state<string | null>(null);
</script>

<CatalogPage group="containment" {sections}>
	<Section
		id="card"
		title="Card"
		description="Hold one thing with its own actions: a plant, an order, a slot. Give it a tone to make it a colour block."
	>
		<Demo label="Plant card" layout="block" frame={false}>
			<Card.Root class="max-w-sm">
				<Card.Header>
					<Card.Title>{hellebore.name}</Card.Title>
					<Card.Description>{hellebore.care}</Card.Description>
					<Card.Action>
						<Badge variant={stockBadge[stockState(hellebore)]}>{available} available</Badge>
					</Card.Action>
				</Card.Header>
				<Card.Content class="flex items-end justify-between gap-4">
					<div>
						<p class="font-display text-3xl leading-none font-extrabold tracking-[-0.03em] tabular-nums">
							{formatMoney(hellebore.price)}
						</p>
						<p class="mt-1.5 text-sm text-muted-foreground">{hellebore.form}</p>
					</div>
					<div class="flex items-center gap-1" role="group" aria-label="Quantity">
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="One fewer"
							disabled={qty <= 1}
							onclick={() => (qty -= 1)}
						>
							<MinusIcon />
						</Button>
						<output class="w-8 text-center font-display font-bold tabular-nums" aria-live="polite">{qty}</output>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="One more"
							disabled={qty >= available}
							onclick={() => (qty += 1)}
						>
							<PlusIcon />
						</Button>
					</div>
				</Card.Content>
				<Card.Footer class="border-t">
					<Button class="w-full">Add {qty} to order, {formatMoney(qty * hellebore.price)}</Button>
				</Card.Footer>
			</Card.Root>
		</Demo>

		<Demo label="Tones: the next three van runs" layout="block" frame={false}>
			<div class="@container">
				<div class="grid gap-4 @3xl:grid-cols-3">
					{#each runs as r (r.date)}
						<Card.Root tone={r.tone}>
							<Card.Header>
								<Card.Title>{formatLongDate(r.date)}</Card.Title>
								<Card.Description>
									{r.count === 0 ? 'Nothing booked yet.' : `${r.count} orders on the van so far.`}
								</Card.Description>
							</Card.Header>
							<Card.Content>
								<ul class="flex flex-col border-t border-hairline">
									{#each r.slots as slot (slot.id)}
										{@const key = `${r.date}-${slot.id}`}
										{@const booked = bookedSlot === key}
										<li class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-hairline py-3">
											<div class="min-w-0">
												<p class="font-display font-bold">{slot.label}</p>
												<p class="text-sm tabular-nums">{slot.window}</p>
												<p class="text-sm tabular-nums">
													{slot.booked + (booked ? 1 : 0)} booked{booked ? ', one is yours' : ''}
												</p>
											</div>
											<Button
												variant={booked ? 'outline' : r.tone === 'ink' ? 'secondary' : 'default'}
												size="sm"
												aria-pressed={booked}
												aria-label={`${booked ? 'Cancel' : 'Book'} the ${slot.label.toLowerCase()} slot on ${formatLongDate(r.date)}`}
												onclick={() => (bookedSlot = booked ? null : key)}
											>
												{booked ? 'Cancel' : 'Book'}
											</Button>
										</li>
									{/each}
								</ul>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</div>
		</Demo>

		<Demo label="Small, on the warm block" tone="warm" layout="block">
			<Card.Root size="sm" class="max-w-xs">
				<Card.Header>
					<Card.Title>Order {smallOrder.id}</Card.Title>
					<Card.Description>{smallOrder.customer.name}, placed {formatLongDate(smallOrder.placed)}</Card.Description>
				</Card.Header>
				<Card.Content class="flex items-baseline justify-between text-sm">
					<span>{orderItems(smallOrder)} plants, delivery</span>
					<span class="font-display font-bold tabular-nums">{formatMoney(orderTotal(smallOrder))}</span>
				</Card.Content>
			</Card.Root>
		</Demo>
	</Section>

	<Section
		id="item"
		title="Item"
		description="A row in a list: media, a title, a line of detail and actions. Group rows to get hairlines between them."
	>
		<Demo label="Today's orders" layout="block">
			<Item.Group role="group" aria-label="Today's orders">
				{#each todays as o (o.id)}
					<Item.Root class="aria-pressed:before:bg-current/10">
						{#snippet child({ props })}
							<button
								{...props}
								type="button"
								aria-pressed={selectedOrder === o.id}
								onclick={() => (selectedOrder = o.id)}
							>
								<Item.Media>
									<Avatar.Root>
										<Avatar.Fallback>{o.customer.initials}</Avatar.Fallback>
									</Avatar.Root>
								</Item.Media>
								<Item.Content>
									<Item.Title>{o.id} {o.customer.name}</Item.Title>
									<Item.Description>{orderSummary(o)}</Item.Description>
								</Item.Content>
								<Item.Actions class="flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
									<Badge variant={statusBadge[o.status]}>{o.status}</Badge>
									<span class="font-display font-bold tabular-nums">{formatMoney(orderTotal(o))}</span>
								</Item.Actions>
							</button>
						{/snippet}
					</Item.Root>
				{/each}
			</Item.Group>
			{#if selected}
				<p class="mt-4 text-sm text-muted-foreground" aria-live="polite">
					{selected.id} for {selected.customer.name}: {selected.status.toLowerCase()}, {formatMoney(
						orderTotal(selected)
					)}.
				</p>
			{/if}
		</Demo>

		<Demo label="Outline, on the cool block" tone="cool" layout="stack">
			<Item.Root variant="outline">
				<Item.Media>
					<Avatar.Root size="lg">
						<Avatar.Fallback>{staff.priya.initials}</Avatar.Fallback>
					</Avatar.Root>
				</Item.Media>
				<Item.Content>
					<Item.Title>{staff.priya.name}</Item.Title>
					<Item.Description>
						{staff.priya.role}. Out on {run.van} since {formatTime(run.left)}, {run.stops} stops today.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="outline" size="sm" href={`mailto:${staff.priya.email}`}>Email Priya</Button>
				</Item.Actions>
			</Item.Root>
			<Item.Root variant="outline" size="sm">
				<Item.Media variant="icon">
					<TruckIcon aria-hidden="true" />
				</Item.Media>
				<Item.Content>
					<Item.Title>Free delivery on orders of {formatMoney(delivery.freeOver)} or more</Item.Title>
				</Item.Content>
			</Item.Root>
		</Demo>
	</Section>

	<Section
		id="accordion"
		title="Accordion"
		description="Questions people scan before they read. Keep one answer open at a time unless the rows stand alone."
	>
		<Demo label="Plant care" layout="block">
			<Accordion.Root type="single" value="hellebore">
				<Accordion.Item value="hellebore">
					<Accordion.Trigger>When should I cut back my hellebores?</Accordion.Trigger>
					<Accordion.Content>
						<p>{plants.hellebore.care}</p>
						<p>Leave the new leaves. They feed next year’s plant.</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="foxglove">
					<Accordion.Trigger>My foxgloves have leaves but no flowers. Did I do something wrong?</Accordion.Trigger>
					<Accordion.Content>
						<p>No. {plants.foxglove.care}</p>
						<p>Leave a few spikes to drop seed and you will have plants every year.</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="witch-hazel">
					<Accordion.Trigger>Where should I plant witch hazel?</Accordion.Trigger>
					<Accordion.Content>
						<p>{plants.witchHazel.care}</p>
						<p>It grows slowly, so plant it where you can smell it from the path and give it room.</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="roses">
					<Accordion.Trigger>Can I plant bare-root roses in a frost?</Accordion.Trigger>
					<Accordion.Content>
						Not into frozen ground. Plant within a week of delivery, and if the ground is frozen, heel them into a
						bucket of compost. The pre-orders arrive {formatLongDate(plants.rose.arrives)}.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Demo>

		<Demo label="Several open, on the cool block" tone="cool" layout="block">
			<Accordion.Root type="multiple" value={['days']}>
				<Accordion.Item value="days">
					<Accordion.Trigger>Which days do you deliver?</Accordion.Trigger>
					<Accordion.Content>
						Tuesday, Thursday and Saturday, within {delivery.radiusMiles} miles of the yard. Mornings run
						{delivery.slots[0].window}, afternoons {delivery.slots[1].window}.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="cost">
					<Accordion.Trigger>What does delivery cost?</Accordion.Trigger>
					<Accordion.Content>
						{formatMoney(delivery.fee)} on orders under {formatMoney(delivery.freeOver)}. Free from
						{formatMoney(delivery.freeOver)}.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="collect">
					<Accordion.Trigger>Can I collect instead?</Accordion.Trigger>
					<Accordion.Content>Yes. {delivery.collection}</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Demo>
	</Section>

	<Section
		id="collapsible"
		title="Collapsible"
		description="Hide detail behind one trigger when most people will not need it."
	>
		<Demo label="Order notes" layout="block">
			<Collapsible.Root bind:open={notesOpen} class="max-w-md">
				<div class="flex items-center justify-between gap-4">
					<p class="font-display font-bold">{preorder.id}, {preorder.customer.name}</p>
					<Collapsible.Trigger class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
						{notesOpen ? 'Hide notes' : `Show ${preorderNotes.length} notes`}
						<ChevronDownIcon
							data-icon="inline-end"
							class={['transition-transform duration-150', notesOpen && 'rotate-180']}
						/>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<ul class="mt-3 flex flex-col border-t text-[0.9375rem]">
						{#each preorderNotes as note (note)}
							<li class="border-b py-3">{note}</li>
						{/each}
					</ul>
				</Collapsible.Content>
			</Collapsible.Root>
		</Demo>
	</Section>

	<Section
		id="separator"
		title="Separator"
		description="The ink hairline. Use it between groups that need more than space to tell them apart."
	>
		<Demo label="Horizontal and vertical" layout="stack">
			<div>
				<p class="font-display font-bold">{shop.name}</p>
				<p class="text-sm text-muted-foreground">Open {shop.hours}</p>
			</div>
			<Separator />
			<div class="flex h-5 items-center gap-4 text-sm">
				<span>Plants</span>
				<Separator orientation="vertical" />
				<span>Deliveries</span>
				<Separator orientation="vertical" />
				<span>Accounts</span>
			</div>
		</Demo>
		<Demo label="On the ink card" tone="ink" layout="stack">
			<p class="font-display text-lg font-bold">Thursday takings</p>
			<Separator />
			<dl class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm tabular-nums">
				<dt>Till</dt>
				<dd class="text-right">$1,912.40</dd>
				<dt>Online orders</dt>
				<dd class="text-right">{placedToday.length}, {formatMoney(onlineToday)}</dd>
				<dt>Refunds</dt>
				<dd class="text-right">{formatMoney(refundsToday)}</dd>
			</dl>
		</Demo>
	</Section>

	<Section
		id="aspect-ratio"
		title="Aspect ratio"
		description="Hold a frame at a fixed shape while the width changes, for images, labels and maps."
	>
		<Demo label="Shelf label 3:2, pot tag 1:1" layout="block">
			<div class="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
				<AspectRatio
					ratio={3 / 2}
					class="flex flex-col justify-between rounded-lg bg-secondary p-4 text-secondary-foreground md:p-6"
				>
					<p class="font-display text-lg leading-tight font-extrabold tracking-[-0.02em] md:text-2xl">
						{plants.lavender.name}
					</p>
					<p class="flex items-baseline justify-between gap-2 text-sm">
						<span>Full sun</span>
						<span class="font-display text-xl font-extrabold tabular-nums md:text-3xl">
							{formatMoney(plants.lavender.price)}
						</span>
					</p>
				</AspectRatio>
				<AspectRatio
					ratio={1}
					class="flex flex-col justify-between rounded-lg bg-accent p-4 text-accent-foreground md:p-6"
				>
					<p class="font-display leading-tight font-extrabold md:text-xl">{plants.seaHolly.name}</p>
					<p class="text-sm">Eryngium</p>
				</AspectRatio>
			</div>
		</Demo>
	</Section>

	<Section
		id="scroll-area"
		title="Scroll area"
		description="Scroll a long list inside a fixed height without taking over the page's own scroll."
	>
		<Demo label="Delivery log" layout="block">
			<ScrollArea class="h-80 rounded-md border" aria-label="Delivery log">
				<ol class="px-4">
					{#each log as entry (entry.t)}
						<li class="grid gap-1 border-b py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
							<span class="text-sm text-muted-foreground tabular-nums">{entry.t}</span>
							<span class="text-[0.9375rem]">{entry.e}</span>
						</li>
					{/each}
				</ol>
			</ScrollArea>
		</Demo>
	</Section>

	<Section
		id="resizable"
		title="Resizable"
		description="Let people trade space between panes, such as an order list and its detail."
	>
		<Demo label="Orders and detail" layout="block">
			<Resizable.PaneGroup direction="horizontal" class="min-h-64 rounded-lg border">
				<Resizable.Pane defaultSize={42} minSize={25}>
					<ul class="flex flex-col p-4 text-sm">
						{#each todays as o (o.id)}
							<li class="flex justify-between gap-2 border-b py-2.5 last:border-b-0">
								<span class="truncate">{o.id} {o.customer.name}</span>
								<span class="tabular-nums">{formatMoney(orderTotal(o))}</span>
							</li>
						{/each}
					</ul>
				</Resizable.Pane>
				<Resizable.Handle withHandle />
				<Resizable.Pane defaultSize={58} minSize={30}>
					<div class="flex h-full flex-col gap-2 p-4 md:p-6">
						<p class="font-display text-lg font-extrabold tracking-[-0.02em]">
							{outNow.id} {outNow.customer.name}
						</p>
						<p class="text-sm text-muted-foreground">
							{orderSummary(outNow)}. Out with {firstName(run.driver.name)} on {outNow.van}, due between
							{outSlot?.window.replace(' to ', ' and ')} at {outNow.customer.street}.
						</p>
					</div>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>
		<Demo label="Vertical, on the warm block" tone="warm" layout="block">
			<Resizable.PaneGroup direction="vertical" class="min-h-56 rounded-lg border border-hairline">
				<Resizable.Pane defaultSize={50} minSize={25}>
					<p class="p-4 text-sm">
						{firstName(staff.tomasz.name)}: {hellebore.stock} hellebores in the {hellebore.location.toLowerCase()},
						{hellebore.reserved} of them reserved.
					</p>
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane defaultSize={50} minSize={25}>
					<p class="p-4 text-sm">
						{firstName(staff.nell.name)}: frost tonight, down to {weather.frostLow}. The hellebores and young
						foxgloves go into tunnel 1 before we close.
					</p>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>
	</Section>

	<Section
		id="carousel"
		title="Carousel"
		description="Show a few things of the same kind side by side, one swipe at a time."
	>
		<Demo label="Seasonal picks" layout="block">
			<Carousel.Root opts={{ align: 'start' }} setApi={connectCarousel}>
				<div class="mb-4 flex items-center justify-between gap-4">
					<p class="text-sm tabular-nums" aria-live="polite">{slide} of {slideCount}</p>
					<div class="flex gap-2">
						<Carousel.Previous class="static my-0" />
						<Carousel.Next class="static my-0" />
					</div>
				</div>
				<Carousel.Content>
					{#each picks as pick (pick.plant.id)}
						<Carousel.Item class="basis-[85%] sm:basis-1/2 lg:basis-1/3">
							<Card.Root tone={pick.tone} class="h-full">
								<Card.Header>
									<Card.Title>{pick.plant.name}</Card.Title>
									<Card.Description>{pick.when}</Card.Description>
								</Card.Header>
								<Card.Content class="mt-auto flex items-baseline justify-between gap-3">
									<p class="font-display text-2xl font-extrabold tracking-[-0.03em] tabular-nums">
										{formatMoney(pick.plant.price)}
									</p>
									<p class="text-sm">{pick.plant.form}</p>
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
			</Carousel.Root>
		</Demo>
	</Section>

	<Section
		id="avatar"
		title="Avatar"
		description="Show who did something. Initials on the warm tint when there is no photo."
	>
		<Demo label="Sizes">
			<Avatar.Root size="sm"><Avatar.Fallback>{staff.june.initials}</Avatar.Fallback></Avatar.Root>
			<Avatar.Root><Avatar.Fallback>{staff.tomasz.initials}</Avatar.Fallback></Avatar.Root>
			<Avatar.Root size="lg"><Avatar.Fallback>{staff.nell.initials}</Avatar.Fallback></Avatar.Root>
		</Demo>
		<Demo label="The staff, all in today" layout="block">
			<ul class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
				{#each staffList as person (person.id)}
					<li class="flex items-center gap-3">
						<Avatar.Root>
							<Avatar.Fallback>{person.initials}</Avatar.Fallback>
							<Avatar.Badge />
						</Avatar.Root>
						<div class="min-w-0">
							<p class="truncate font-display font-bold">{person.name}</p>
							<p class="text-sm text-muted-foreground">{person.role}, {shiftNote(person.id)}</p>
						</div>
					</li>
				{/each}
			</ul>
		</Demo>
		<Demo label="Group, on the cool block" tone="cool">
			<Avatar.Group>
				{#each staffList.slice(0, 3) as person (person.id)}
					<Avatar.Root size="lg"><Avatar.Fallback>{person.initials}</Avatar.Fallback></Avatar.Root>
				{/each}
				<Avatar.GroupCount>+{staffList.length - 3}</Avatar.GroupCount>
			</Avatar.Group>
			<p class="text-sm">Nell, Tomasz, Priya and June are on this week’s rota.</p>
		</Demo>
	</Section>

	<Section id="empty" title="Empty" description="Say what is missing and offer the one action that fills it.">
		<Demo label="No deliveries scheduled" layout="block">
			{#if emptyRunDrops.length === 0}
				<Empty.Root>
					<Empty.Header>
						<Empty.Media variant="icon">
							<TruckIcon aria-hidden="true" />
						</Empty.Media>
						<Empty.Title>No deliveries scheduled</Empty.Title>
						<Empty.Description>
							Nothing is booked on the van for {formatLongDate(emptyRun)}. Book an order onto the run and it shows up
							here.
						</Empty.Description>
					</Empty.Header>
					<Empty.Content>
						<Button onclick={bookDelivery}>Book a delivery</Button>
					</Empty.Content>
				</Empty.Root>
			{:else}
				<div class="flex flex-col gap-4">
					<p class="font-display text-xl font-extrabold tracking-[-0.02em]">{formatLongDate(emptyRun)}</p>
					<ul class="border-t">
						{#each emptyRunDrops as drop (drop.id)}
							<li class="flex justify-between gap-4 border-b py-3 text-[0.9375rem]">
								<span>{drop.id}, {drop.who}</span>
								<span class="text-muted-foreground tabular-nums">{drop.slot}</span>
							</li>
						{/each}
					</ul>
					<Button variant="outline" size="sm" class="self-start" onclick={() => (emptyRunDrops = [])}>
						Cancel the delivery
					</Button>
				</div>
			{/if}
		</Demo>
		<Demo label="Framed, on the warm block" tone="warm" layout="block">
			{#if orderNote === null}
				<Empty.Root class="border border-hairline">
					<Empty.Header>
						<Empty.Title>No notes on {noteOrder.id}</Empty.Title>
						<Empty.Description>
							Add gate codes, pets or where to leave plants. {firstName(run.driver.name)} sees notes on the van.
						</Empty.Description>
					</Empty.Header>
					<Empty.Content>
						<Button
							variant="outline"
							size="sm"
							onclick={() => (orderNote = 'Leave the dogwood in the porch by the side door.')}
						>
							Add a note
						</Button>
					</Empty.Content>
				</Empty.Root>
			{:else}
				<div class="flex flex-col items-start gap-4 rounded-lg border border-hairline p-6 md:p-10">
					<p class="font-display text-lg font-extrabold tracking-[-0.02em]">Note on {noteOrder.id}</p>
					<p class="text-[0.9375rem]">{orderNote}</p>
					<Button variant="outline" size="sm" onclick={() => (orderNote = null)}>Delete note</Button>
				</div>
			{/if}
		</Demo>
	</Section>
</CatalogPage>
