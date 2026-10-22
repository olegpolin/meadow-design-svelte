<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
	import SproutIcon from '@lucide/svelte/icons/sprout';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import UsersIcon from '@lucide/svelte/icons/users';
	import LandmarkIcon from '@lucide/svelte/icons/landmark';
	import { CatalogPage, Section, Demo } from '#lib/components/showcase/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';
	import * as Pagination from '#lib/components/ui/pagination/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '#lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import * as Menubar from '#lib/components/ui/menubar/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as ContextMenu from '#lib/components/ui/context-menu/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import {
		TODAY,
		customerList,
		customers,
		delivery,
		formatDate,
		formatLongDate,
		formatMoney,
		formatMonthDay,
		formatTime,
		order,
		orderSummary,
		orderTotal,
		orders,
		plantList,
		plants,
		shop,
		shortcuts,
		staff,
		staffList,
		statusBadge,
		stockState,
		type Order,
		type OrderStatus,
		type Plant
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'tabs', title: 'Tabs' },
		{ id: 'breadcrumb', title: 'Breadcrumb' },
		{ id: 'pagination', title: 'Pagination' },
		{ id: 'navigation-menu', title: 'Navigation menu' },
		{ id: 'menubar', title: 'Menubar' },
		{ id: 'dropdown-menu', title: 'Dropdown menu' },
		{ id: 'context-menu', title: 'Context menu' },
		{ id: 'sidebar', title: 'Sidebar' }
	];

	/* Demo links stay on the page. */
	const stay = (event: MouseEvent) => event.preventDefault();

	const listJoin = (items: readonly string[]) =>
		items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

	/** "Ctrl+N" */
	const keys = (shortcut: { keys: readonly string[] }) => shortcut.keys.join('+');

	const firstName = (name: string) => name.split(' ')[0];
	const newestFirst = [...orders].reverse();
	const isPreOrder = (o: Order) => o.lines.some((l) => l.plant.arrives);
	const openOrders = orders.filter((o) => o.status === 'Open');
	const run = delivery.todayRun;
	const nextRun = delivery.nextRuns[0];

	/* ---------------------------------------------------------------- Tabs */

	const statuses = Object.keys(statusBadge) as OrderStatus[];
	let orderTab = $state<OrderStatus>('Open');
	let plantTab = $state('care');
	let runTab = $state<string>(nextRun);

	/** What the last column of an order row says. */
	function dueLabel(o: Order) {
		if (o.status === 'Cancelled') return 'Refunded';
		if (!o.due) return 'No date';
		if (o.due === TODAY) return 'Today';
		return o.fulfilment === 'collection' ? `Collect ${formatDate(o.due)}` : formatDate(o.due);
	}

	const hellebore = plants.hellebore;
	const helleboreOrders = openOrders.filter((o) => o.lines.some((l) => l.plant.id === hellebore.id));

	const slotLabel = (id?: string) => delivery.slots.find((s) => s.id === id)?.label ?? '';
	const runStops = (date: string) =>
		orders
			.filter((o) => o.fulfilment === 'delivery' && o.status !== 'Cancelled' && o.due === date)
			.sort((a, b) => (a.slot ?? '').localeCompare(b.slot ?? ''));

	/* ---------------------------------------------------------- Pagination */

	const narrow = new MediaQuery('max-width: 639px');
	const perPage = 4;
	let ledgerPage = $state(1);
	const ledgerRows = $derived(newestFirst.slice((ledgerPage - 1) * perPage, ledgerPage * perPage));
	let customerPage = $state(1);
	const shownCustomer = $derived(customerList[customerPage - 1]);

	/* ----------------------------------------------------- Navigation menu */

	const plantLinks = [
		{ title: 'Perennials', text: 'Hellebores, foxgloves, lavender, sea holly and bronze fennel.' },
		{ title: 'Shrubs', text: `Witch hazel and dogwood in pots. Bare-root roses land ${formatLongDate(plants.rose.arrives)}.` },
		{ title: 'Trees', text: `${plants.apple.name}, bare-root. Pre-order now; it lands ${formatLongDate(plants.apple.arrives)}.` },
		{ title: 'Sundries', text: `${plants.compost.name}, ${formatMoney(plants.compost.price)} for a ${plants.compost.form}.` }
	];

	const visitLinks = [
		{ title: 'Opening hours', text: `${shop.hours}. Closed on ${listJoin(shop.closedDays)}s.` },
		{
			title: 'Local delivery',
			text: `Within ${delivery.radiusMiles} miles on ${listJoin(delivery.days)}. ${formatMoney(delivery.fee)} on orders under ${formatMoney(delivery.freeOver)}, free above that.`
		},
		{ title: 'Collection', text: delivery.collection }
	];

	/* ------------------------------------------------------------- Menubar */

	let showDelivered = $state(false);
	let pricesWithTax = $state(true);
	let sortBy = $state('date');
	let signedIn = $state<string>(staff.nell.id);
	const sortLabels: Record<string, string> = { date: 'delivery date', customer: 'customer', total: 'order total' };
	const signedInName = $derived(staffList.find((p) => p.id === signedIn)?.name);

	/* ------------------------------------------------------- Dropdown menu */

	const menuOrder = order('#4479');
	let van = $state<string>(delivery.vans.find((v) => v.name === menuOrder.van)?.id ?? 'none');
	let careCard = $state(true);
	let sideGate = $state(false);
	let lastAction = $state('');
	const vanText = $derived.by(() => {
		const chosen = delivery.vans.find((v) => v.id === van);
		return chosen ? `Going in ${chosen.name} with ${chosen.driver.name}.` : 'No van assigned yet.';
	});

	/* -------------------------------------------------------- Context menu */

	type Listing = Plant & { online: boolean };

	const listed = [plants.hellebore, plants.hosta, plants.rose, plants.apple];
	const startingListings = (): Listing[] => listed.map((p) => ({ ...p, online: p.stock > 0 || stockState(p) === 'Pre-order' }));
	let listings = $state(startingListings());
	const places = ['Shade house', 'Polytunnel 1', 'Polytunnel 2', 'Cold store'];

	function stockText(p: Listing) {
		const state = stockState(p);
		if (state === 'Pre-order' && p.arrives) return `Pre-order, lands ${formatMonthDay(p.arrives)}`;
		if (state === 'Sold out') return p.arrives ? 'Sold out until spring' : 'Sold out';
		return `${p.stock} in stock`;
	}

	/* ------------------------------------------------------------- Sidebar */

	type Variant = 'sidebar' | 'floating' | 'inset';
	let sidebarVariant = $state<Variant>('sidebar');
	let activeNav = $state('Orders');

	const nav = [
		{ title: 'Orders', icon: ShoppingBasketIcon, badge: String(openOrders.length) },
		{ title: 'Plants', icon: SproutIcon },
		{ title: 'Deliveries', icon: TruckIcon, badge: String(run.stops) },
		{ title: 'Customers', icon: UsersIcon },
		{ title: 'Accounts', icon: LandmarkIcon }
	];

	const packedForNextRun = orders.filter((o) => o.status === 'Packed' && o.due === nextRun).length;
	const tradeCustomers = customerList.filter((c) => c.trade).length;
	const tradeOrders = orders.filter((o) => o.customer.trade && o.status !== 'Cancelled').length;
	const margueriteOrders = orders.filter((o) => o.customer.id === customers.marguerite.id).length;

	const navSummary: Record<string, string> = {
		Orders: `${openOrders.length} open, ${openOrders.filter(isPreOrder).length} of them pre-orders. ${packedForNextRun} packed for ${formatLongDate(nextRun)}.`,
		Plants: `${plantList.length} listings: ${plantList.filter((p) => stockState(p) === 'Sold out').length} sold out, ${plantList.filter((p) => stockState(p) === 'Pre-order').length} on pre-order. Bare-root roses land ${formatLongDate(plants.rose.arrives)}.`,
		Deliveries: `${firstName(run.driver.name)} left in ${run.van} at ${formatTime(run.left)} with ${run.stops} stops. The next run is ${formatLongDate(nextRun)}.`,
		Customers: `${tradeCustomers} trade customers pay by invoice at the end of the month. ${customers.marguerite.name} has ${margueriteOrders} orders this month.`,
		Accounts: `${firstName(staff.june.name)} invoices ${tradeOrders} trade orders at the end of October. Sales tax is ${(shop.taxRate * 100).toFixed(2)}%.`
	};
</script>

<CatalogPage group="navigation" {sections}>
	<!-- Tabs -->
	<Section id="tabs" title="Tabs" description="Switch between views of the same thing without leaving the page.">
		<Demo label="Order states" layout="block">
			<Tabs.Root bind:value={orderTab}>
				<Tabs.List class="overflow-x-auto no-scrollbar">
					{#each statuses as status (status)}
						<Tabs.Trigger value={status}>
							{status}
							<span class="tabular-nums opacity-70">{orders.filter((o) => o.status === status).length}</span>
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
				{#each statuses as status (status)}
					<Tabs.Content value={status}>
						<ul class="border-t">
							{#each newestFirst.filter((o) => o.status === status) as row (row.id)}
								<li class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-b py-3">
									<span class="font-display font-bold">
										<span class="tabular-nums">{row.id}</span>
										{row.customer.name}
									</span>
									<span class="text-right font-display font-bold tabular-nums">{formatMoney(orderTotal(row))}</span>
									<span class="truncate text-sm text-muted-foreground">{orderSummary(row)}</span>
									<span class="text-right text-sm text-muted-foreground">{dueLabel(row)}</span>
								</li>
							{/each}
						</ul>
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		</Demo>

		<Demo label="Line tabs, on the warm block" tone="warm" layout="block">
			<p class="mb-3 font-display font-bold">{hellebore.name}</p>
			<Tabs.Root bind:value={plantTab}>
				<Tabs.List variant="line">
					<Tabs.Trigger value="care">Care</Tabs.Trigger>
					<Tabs.Trigger value="stock">Stock</Tabs.Trigger>
					<Tabs.Trigger value="orders">Orders</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="care" class="max-w-lg leading-normal">
					{hellebore.care}
				</Tabs.Content>
				<Tabs.Content value="stock" class="max-w-lg leading-normal">
					{hellebore.stock} in the {hellebore.location.toLowerCase()}, {hellebore.reserved} of them reserved.
					{formatMoney(hellebore.price)} for a {hellebore.form}.
				</Tabs.Content>
				<Tabs.Content value="orders" class="max-w-lg leading-normal">
					On {helleboreOrders.length} open orders: {listJoin(helleboreOrders.map((o) => `${o.id} for ${o.customer.name}`))}.
				</Tabs.Content>
			</Tabs.Root>
		</Demo>

		<Demo label="Next van runs, on the ink card" tone="ink" layout="block">
			<Tabs.Root bind:value={runTab}>
				<Tabs.List>
					{#each delivery.nextRuns as date (date)}
						<Tabs.Trigger value={date}>{formatLongDate(date).split(',')[0]}</Tabs.Trigger>
					{/each}
				</Tabs.List>
				{#each delivery.nextRuns as date (date)}
					{@const stops = runStops(date)}
					<Tabs.Content value={date}>
						{#if stops.length === 0}
							<p class="max-w-md text-sm opacity-80">
								Nothing booked for {formatLongDate(date)} yet. Delivery orders land here once they have a date.
							</p>
						{:else}
							<p class="text-sm opacity-80">{formatLongDate(date)}: {stops.length} stops booked</p>
							<ol class="mt-2 flex flex-col gap-2">
								{#each stops as stop (stop.id)}
									<li>
										<span class="font-display font-bold">{stop.customer.name}</span>
										<span class="block text-sm opacity-80">
											{stop.customer.street}. {slotLabel(stop.slot)}, {stop.van}.
										</span>
									</li>
								{/each}
							</ol>
						{/if}
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		</Demo>
	</Section>

	<!-- Breadcrumb -->
	<Section id="breadcrumb" title="Breadcrumb" description="Show where a page sits and link back up the tree.">
		<Demo label="Plant page">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/components/navigation#breadcrumb" onclick={stay}>Plants</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/components/navigation#breadcrumb" onclick={stay}>{hellebore.category}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{hellebore.name}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</Demo>

		<Demo label="Collapsed levels, on the cool block" tone="cool">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/components/navigation#breadcrumb" onclick={stay}>Customers</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="ghost" size="icon-sm" aria-label="Show hidden levels">
										<EllipsisIcon />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-auto">
								<DropdownMenu.Group>
									<DropdownMenu.Item>{order('#4474').customer.name}</DropdownMenu.Item>
									<DropdownMenu.Item>Orders</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/components/navigation#breadcrumb" onclick={stay}>{order('#4474').id}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Delivery note</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</Demo>
	</Section>

	<!-- Pagination -->
	<Section id="pagination" title="Pagination" description="Step through a long list a page at a time.">
		<Demo label="The order ledger, {perPage} a page" layout="stack">
			<ul class="border-t">
				{#each ledgerRows as row (row.id)}
					<li class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b py-3">
						<span class="truncate">
							<span class="font-display font-bold tabular-nums">{row.id}</span>
							{row.customer.name}
						</span>
						<span class="font-display font-bold tabular-nums">{formatMoney(orderTotal(row))}</span>
					</li>
				{/each}
			</ul>
			<Pagination.Root count={orders.length} {perPage} bind:page={ledgerPage}>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
			<p class="text-center text-sm text-muted-foreground tabular-nums">
				Orders {ledgerRows[0].id} to {ledgerRows[ledgerRows.length - 1].id}, newest first
			</p>
		</Demo>

		<Demo label="Customers one at a time, on the ink card" tone="ink" layout="stack">
			<p class="text-center text-sm">
				<span class="font-display font-bold">{shownCustomer.name}</span>
				<span class="block opacity-80">{shownCustomer.street}, {shownCustomer.town}</span>
			</p>
			<Pagination.Root count={customerList.length} perPage={1} siblingCount={narrow.current ? 0 : 1} bind:page={customerPage}>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</Demo>
	</Section>

	<!-- Navigation menu -->
	<Section
		id="navigation-menu"
		title="Navigation menu"
		description="Top-level site links, with a panel for sections that have many pages."
	>
		<Demo label="Shop site header" layout="block" class="pb-20 md:pb-24">
			<NavigationMenu.Root>
				<NavigationMenu.List class="justify-start">
					<NavigationMenu.Item>
						<NavigationMenu.Trigger>Plants</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<ul class="grid w-[min(34rem,calc(100vw-5.5rem))] gap-1 sm:grid-cols-2">
								{#each plantLinks as link (link.title)}
									<li>
										<NavigationMenu.Link href="/components/navigation#navigation-menu" onclick={stay}>
											<div class="flex flex-col gap-1">
												<span class="font-display font-bold">{link.title}</span>
												<span class="text-sm leading-snug text-muted-foreground">{link.text}</span>
											</div>
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger>Visit</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<ul class="grid w-[min(20rem,calc(100vw-5.5rem))] gap-1">
								{#each visitLinks as link (link.title)}
									<li>
										<NavigationMenu.Link href="/components/navigation#navigation-menu" onclick={stay}>
											<div class="flex flex-col gap-1">
												<span class="font-display font-bold">{link.title}</span>
												<span class="text-sm leading-snug text-muted-foreground">{link.text}</span>
											</div>
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/components/navigation#navigation-menu" onclick={stay} class={navigationMenuTriggerStyle()}>
							Pre-orders
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</Demo>
	</Section>

	<!-- Menubar -->
	<Section
		id="menubar"
		title="Menubar"
		description="A row of menus for a tool with many commands, like the order desk."
	>
		<Demo label="Order desk" layout="stack">
			<Menubar.Root>
				<Menubar.Menu>
					<Menubar.Trigger>Order</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Group>
							<Menubar.Item>{shortcuts.newOrder.label} <Menubar.Shortcut>{keys(shortcuts.newOrder)}</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>{shortcuts.save.label} <Menubar.Shortcut>{keys(shortcuts.save)}</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>{shortcuts.print.label} <Menubar.Shortcut>{keys(shortcuts.print)}</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>{shortcuts.markPacked.label} <Menubar.Shortcut>{keys(shortcuts.markPacked)}</Menubar.Shortcut></Menubar.Item>
						</Menubar.Group>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Send to</Menubar.SubTrigger>
							<Menubar.SubContent>
								{#each [staff.priya, staff.tomasz, staff.june] as person (person.id)}
									<Menubar.Item>{person.name}</Menubar.Item>
								{/each}
							</Menubar.SubContent>
						</Menubar.Sub>
						<Menubar.Separator />
						<Menubar.Item variant="destructive">Cancel order</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Edit</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>Undo</Menubar.Item>
						<Menubar.Item disabled>Redo</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item>{shortcuts.search.label} <Menubar.Shortcut>{keys(shortcuts.search)}</Menubar.Shortcut></Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.CheckboxItem bind:checked={showDelivered}>Show delivered orders</Menubar.CheckboxItem>
						<Menubar.CheckboxItem bind:checked={pricesWithTax}>Prices with sales tax</Menubar.CheckboxItem>
						<Menubar.Item>{shortcuts.sidebar.label} <Menubar.Shortcut>{keys(shortcuts.sidebar)}</Menubar.Shortcut></Menubar.Item>
						<Menubar.Separator />
						<Menubar.Label inset>Sort by</Menubar.Label>
						<Menubar.RadioGroup bind:value={sortBy}>
							<Menubar.RadioItem value="date">Delivery date</Menubar.RadioItem>
							<Menubar.RadioItem value="customer">Customer</Menubar.RadioItem>
							<Menubar.RadioItem value="total">Order total</Menubar.RadioItem>
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Staff</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Label inset>Signed in as</Menubar.Label>
						<Menubar.RadioGroup bind:value={signedIn}>
							{#each staffList as person (person.id)}
								<Menubar.RadioItem value={person.id}>{person.name}</Menubar.RadioItem>
							{/each}
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
			<p class="text-sm text-muted-foreground">
				{signedInName}, sorting by {sortLabels[sortBy]}. Delivered orders {showDelivered ? 'shown' : 'hidden'},
				prices {pricesWithTax ? 'with' : 'without'} sales tax.
			</p>
		</Demo>

		<Demo label="On the warm block" tone="warm">
			<Menubar.Root>
				<Menubar.Menu>
					<Menubar.Trigger>Stock</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>Count a bed</Menubar.Item>
						<Menubar.Item>Start a stock take</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item>{shortcuts.print.label} <Menubar.Shortcut>{keys(shortcuts.print)}</Menubar.Shortcut></Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Reports</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>October sales</Menubar.Item>
						<Menubar.Item>Sold out and pre-orders</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</Demo>
	</Section>

	<!-- Dropdown menu -->
	<Section id="dropdown-menu" title="Dropdown menu" description="A short list of actions or settings behind one button.">
		<Demo label="Order actions" layout="stack">
			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">
								Order {menuOrder.id}
								<ChevronDownIcon data-icon="inline-end" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-64">
						<DropdownMenu.Group>
							<DropdownMenu.Label>{menuOrder.customer.name}, {formatMoney(orderTotal(menuOrder))}</DropdownMenu.Label>
							<DropdownMenu.Item onSelect={() => (lastAction = `Opened order ${menuOrder.id}.`)}>View order</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => (lastAction = `Moved the delivery to ${formatDate(delivery.nextRuns[2])}.`)}>
								Move to Thursday
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => (lastAction = 'Sent the label to the shed printer.')}>
								{shortcuts.print.label}
								<DropdownMenu.Shortcut>{keys(shortcuts.print)}</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>Assign a van</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.RadioGroup bind:value={van}>
										{#each delivery.vans as option (option.id)}
											<DropdownMenu.RadioItem value={option.id}>{option.name}, {firstName(option.driver.name)}</DropdownMenu.RadioItem>
										{/each}
										<DropdownMenu.RadioItem value="none">Unassigned</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.CheckboxItem bind:checked={careCard}>Add a care card</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem bind:checked={sideGate}>Leave by the side gate</DropdownMenu.CheckboxItem>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							variant="destructive"
							onSelect={() => (lastAction = `Order ${menuOrder.id} cancelled. ${firstName(menuOrder.customer.name)} gets an email.`)}
						>
							Cancel order
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<p class="text-sm text-muted-foreground">
				{vanText} {careCard ? 'Care card added' : 'No care card'}, {sideGate ? 'left by the side gate' : 'handed over at the door'}.
				{lastAction}
			</p>
		</Demo>

		<Demo label="Account menu, on the ink card" tone="ink">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline">
							{staff.nell.name}
							<ChevronDownIcon data-icon="inline-end" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-60">
					<DropdownMenu.Label>{staff.nell.email}</DropdownMenu.Label>
					<DropdownMenu.Group>
						<DropdownMenu.Item>Shop settings</DropdownMenu.Item>
						<DropdownMenu.Item>Staff and roles</DropdownMenu.Item>
						<DropdownMenu.Item disabled>Payouts ({firstName(staff.june.name)} only)</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Sign out</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Demo>
	</Section>

	<!-- Context menu -->
	<Section
		id="context-menu"
		title="Context menu"
		description="Actions for one item, opened with a right-click or a long press."
	>
		<Demo label="Plant listings" layout="stack">
			<p class="text-sm text-muted-foreground">Right-click a plant, or press and hold on a touchscreen.</p>
			{#if listings.length === 0}
				<div class="flex flex-col items-start gap-3 border-t pt-4">
					<p class="text-[0.9375rem]">No plants listed. Put the {listed.length} listings back to try the menu again.</p>
					<Button size="sm" variant="outline" onclick={() => (listings = startingListings())}>Put the listings back</Button>
				</div>
			{:else}
				<ul class="border-t">
					{#each listings as plant (plant.id)}
						<li class="border-b">
							<ContextMenu.Root>
								<ContextMenu.Trigger
									class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 rounded-md px-2 py-3 transition-[background-color] duration-150 data-open:bg-current/10"
								>
									<span class="truncate font-display font-bold">{plant.name}</span>
									<span class="text-right font-display font-bold tabular-nums">{formatMoney(plant.price)}</span>
									<span class="truncate text-sm text-muted-foreground">
										{plant.location} · {plant.online ? 'On the website' : 'Hidden from the website'}
									</span>
									<span class="text-right text-sm text-muted-foreground tabular-nums">{stockText(plant)}</span>
								</ContextMenu.Trigger>
								<ContextMenu.Content class="w-60">
									<ContextMenu.Group>
										<ContextMenu.Label>{plant.name}</ContextMenu.Label>
										<ContextMenu.Item>Edit listing</ContextMenu.Item>
										<ContextMenu.Item>
											{shortcuts.print.label}
											<ContextMenu.Shortcut>{keys(shortcuts.print)}</ContextMenu.Shortcut>
										</ContextMenu.Item>
										<ContextMenu.Sub>
											<ContextMenu.SubTrigger>Move to</ContextMenu.SubTrigger>
											<ContextMenu.SubContent>
												<ContextMenu.RadioGroup bind:value={plant.location}>
													{#each places as place (place)}
														<ContextMenu.RadioItem value={place}>{place}</ContextMenu.RadioItem>
													{/each}
												</ContextMenu.RadioGroup>
											</ContextMenu.SubContent>
										</ContextMenu.Sub>
										<ContextMenu.CheckboxItem bind:checked={plant.online}>Show on the website</ContextMenu.CheckboxItem>
										<ContextMenu.Item disabled={plant.stock === 0} onSelect={() => (plant.stock = 0)}>
											Mark as sold out
										</ContextMenu.Item>
									</ContextMenu.Group>
									<ContextMenu.Separator />
									<ContextMenu.Item
										variant="destructive"
										onSelect={() => (listings = listings.filter((p) => p.id !== plant.id))}
									>
										Delete listing
									</ContextMenu.Item>
								</ContextMenu.Content>
							</ContextMenu.Root>
						</li>
					{/each}
				</ul>
			{/if}
		</Demo>
	</Section>

	<!-- Sidebar -->
	<Section
		id="sidebar"
		title="Sidebar"
		description="The main navigation of an app. Click its edge or press {keys(shortcuts.sidebar)} to fold it down to icons."
	>
		<Demo label="Shop admin" layout="stack">
			<ToggleGroup.Root
				type="single"
				variant="outline"
				size="sm"
				spacing={4}
				aria-label="Sidebar variant"
				bind:value={() => sidebarVariant, (v) => v && (sidebarVariant = v as Variant)}
			>
				<ToggleGroup.Item value="sidebar">Sidebar</ToggleGroup.Item>
				<ToggleGroup.Item value="floating">Floating</ToggleGroup.Item>
				<ToggleGroup.Item value="inset">Inset</ToggleGroup.Item>
			</ToggleGroup.Root>

			<div class="relative h-[32rem] overflow-hidden rounded-lg border">
				<Sidebar.Provider contained class="h-full min-h-0">
					<Sidebar.Root collapsible="icon" variant={sidebarVariant}>
						<Sidebar.Header>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton size="lg">
										{#snippet child({ props })}
											<a href="/components/navigation#sidebar" {...props} onclick={stay}>
												<span
													class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-primary-foreground"
													aria-hidden="true"
												>
													{shop.name[0]}
												</span>
												<span class="flex min-w-0 flex-col leading-tight">
													<span class="truncate font-display font-bold">{shop.name}</span>
													<span class="truncate text-xs text-muted-foreground">Shop admin</span>
												</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.Header>
						<Sidebar.Content>
							<Sidebar.Group>
								<Sidebar.GroupLabel>Shop</Sidebar.GroupLabel>
								<Sidebar.GroupContent>
									<Sidebar.Menu>
										{#each nav as item (item.title)}
											<Sidebar.MenuItem>
												<Sidebar.MenuButton
													isActive={activeNav === item.title}
													tooltipContent={item.title}
													onclick={() => (activeNav = item.title)}
												>
													<item.icon />
													<span>{item.title}</span>
												</Sidebar.MenuButton>
												{#if item.badge}
													<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
												{/if}
											</Sidebar.MenuItem>
										{/each}
									</Sidebar.Menu>
								</Sidebar.GroupContent>
							</Sidebar.Group>
						</Sidebar.Content>
						<Sidebar.Footer>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton size="lg">
										<span
											class="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xs font-extrabold text-secondary-foreground"
											aria-hidden="true"
										>
											{staff.nell.initials}
										</span>
										<span class="flex min-w-0 flex-col leading-tight">
											<span class="truncate font-display font-bold">{staff.nell.name}</span>
											<span class="truncate text-xs text-muted-foreground">{staff.nell.email}</span>
										</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.Footer>
						<Sidebar.Rail />
					</Sidebar.Root>

					<Sidebar.Inset class="min-h-0 overflow-y-auto">
						<header class="flex h-14 shrink-0 items-center gap-2 border-b px-3">
							<Sidebar.Trigger />
							<Breadcrumb.Root>
								<Breadcrumb.List>
									<Breadcrumb.Item>
										<Breadcrumb.Link href="/components/navigation#sidebar" onclick={stay}>Shop</Breadcrumb.Link>
									</Breadcrumb.Item>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Page>{activeNav}</Breadcrumb.Page>
									</Breadcrumb.Item>
								</Breadcrumb.List>
							</Breadcrumb.Root>
						</header>
						<div class="flex flex-col gap-4 p-4 md:p-6">
							<h3 class="display-4">{activeNav}</h3>
							<p class="max-w-md text-[0.9375rem] text-muted-foreground">{navSummary[activeNav]}</p>
							{#if activeNav === 'Orders'}
								<ul class="border-t">
									{#each newestFirst.slice(0, 4) as row (row.id)}
										<li class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b py-3">
											<span class="truncate">
												<span class="font-display font-bold tabular-nums">{row.id}</span>
												{row.customer.name}
											</span>
											<span class="font-display font-bold tabular-nums">{formatMoney(orderTotal(row))}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</Sidebar.Inset>
				</Sidebar.Provider>
			</div>
		</Demo>
	</Section>
</CatalogPage>
