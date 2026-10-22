/**
 * Seed data for the dashboard demo. Everything comes from the shared world
 * module (`#lib/demos/world.js`): the order ledger, the plants, the customers,
 * the staff, today's van run and the sales. The few facts the module does not
 * have (the suppliers, the counter-sale stops on today's run, the stop times)
 * live here, consistent with it. The shop state class copies the seed on load.
 */

import {
	TODAY,
	customers,
	delivery,
	formatDate,
	orderItems,
	orders,
	plants,
	plantList,
	stockState,
	type Customer,
	type Order,
	type OrderStatus,
	type Plant,
	type PlantCategory
} from '#lib/demos/world.js';

/* ------------------------------------------------------------------ Orders */

/** A ledger order plus what happens to it during this visit. */
export type ShopOrder = Order & {
	/** ISO date it was packed, set when Mark packed is used. */
	packedAt?: string;
	/** ISO date it was delivered or collected, set when it is marked so. */
	deliveredAt?: string;
	/** ISO date a return was logged; the order stays Delivered. */
	returned?: string;
};

/** The order ledger, #4468 to #4483, exactly as the world module has it. */
export const seedOrders: ShopOrder[] = orders;

/** The order the next step leads to, by status and fulfilment. */
export function nextStep(o: ShopOrder): { label: string; to: OrderStatus; done: string } | undefined {
	switch (o.status) {
		case 'Open':
			return { label: 'Mark packed', to: 'Packed', done: 'packed' };
		case 'Packed':
			return o.fulfilment === 'collection'
				? { label: 'Mark collected', to: 'Delivered', done: 'collected' }
				: { label: 'Send out for delivery', to: 'Out for delivery', done: 'out for delivery' };
		case 'Out for delivery':
			return { label: 'Mark delivered', to: 'Delivered', done: 'delivered' };
		default:
			return undefined;
	}
}

/** The pre-order plant an open order is waiting on, if any. Those cannot be packed yet. */
export const waitingOn = (o: Order): Plant | undefined =>
	o.lines.map((l) => l.plant).find((p) => stockState(p) === 'Pre-order');

/* --------------------------------------------------------------- Today's run */

/** One stop on Priya's run: a ledger order, or a counter sale or pick-up with no order number. */
export type RunStop = {
	id: string;
	/** ISO date-time the stop is booked for. */
	time: string;
	customer: Customer;
	/** Set when the stop is a ledger order; ticking it marks the order Delivered. */
	orderId?: string;
	/** What the stop is, for stops that are not ledger orders. */
	what?: string;
};

/** Booked times for the ledger orders on today's run. */
export const stopTimes: Record<string, string> = {
	'#4474': `${TODAY}T09:25:00`
};

/**
 * The ledger has only one order on today's run (#4474, Van 1, morning), but
 * the run has seven stops. The rest are counter sales customers asked to
 * have delivered, and a pick-up of empty trays: none of them has an order
 * number, so they live here and not in the ledger.
 */
const allExtraStops: (RunStop & { done?: boolean })[] = [
	{ id: 'stop-cora', time: `${TODAY}T09:00:00`, customer: customers.cora, what: `Counter sale, 2 × ${plants.dogwood.name}`, done: true },
	{ id: 'stop-dev', time: `${TODAY}T09:50:00`, customer: customers.dev, what: 'Pick-up, empty plant trays from the café planters' },
	{ id: 'stop-rosa', time: `${TODAY}T10:20:00`, customer: customers.rosa, what: `Counter sale, 2 × ${plants.compost.name}` },
	{ id: 'stop-allotments', time: `${TODAY}T10:55:00`, customer: customers.allotments, what: `Counter sale, 5 × ${plants.bronzeFennel.name}` },
	{ id: 'stop-ines', time: `${TODAY}T11:30:00`, customer: customers.ines, what: `Counter sale, 1 × ${plants.hellebore.name}` },
	{ id: 'stop-samir', time: `${TODAY}T13:15:00`, customer: customers.samir, what: `Counter sale, 3 × ${plants.lavender.name}` }
];

const ledgerStopsToday = orders.filter(
	(o) => o.due === TODAY && o.van === delivery.todayRun.van && o.fulfilment === 'delivery' && o.status !== 'Cancelled'
).length;

/** Exactly enough extra stops to make the run the module's seven. */
export const extraStops = allExtraStops.slice(0, Math.max(delivery.todayRun.stops - ledgerStopsToday, 0));

/* ------------------------------------------------------------------ Plants */

export const categories: PlantCategory[] = ['Perennials', 'Shrubs', 'Trees', 'Sundries'];

/** A world plant plus what the dashboard adds during the visit. */
export type ShopPlant = Plant & {
	/** Units on order from a supplier after a reorder. */
	onOrder?: number;
	/** Supplier id from `suppliers`, or 'grown' for plants Tomasz grows on site. */
	supplier?: string;
};

/** Not in the world module yet: who supplies what, and how long it takes. */
export const suppliers = [
	{ id: 'ellery', name: 'Ellery’s Wholesale Nursery', leadDays: 7, delivers: 'Delivers in about a week.' },
	{ id: 'marchmont', name: 'Marchmont Perennials', leadDays: 3, delivers: 'Delivers in three days.' },
	{ id: 'fenwick', name: 'Fenwick Garden Supply', leadDays: 2, delivers: 'Ships compost and sundries in two days.' }
] as const;

export type SupplierId = (typeof suppliers)[number]['id'];

const plantSupplier: Record<string, SupplierId | 'grown'> = {
	[plants.hellebore.id]: 'marchmont',
	[plants.foxglove.id]: 'grown',
	[plants.seaHolly.id]: 'marchmont',
	[plants.witchHazel.id]: 'ellery',
	[plants.bronzeFennel.id]: 'grown',
	[plants.hosta.id]: 'marchmont',
	[plants.lavender.id]: 'grown',
	[plants.dogwood.id]: 'ellery',
	[plants.rose.id]: 'ellery',
	[plants.apple.id]: 'ellery',
	[plants.compost.id]: 'fenwick'
};

export const seedPlants: ShopPlant[] = plantList.map((p) => ({ ...p, supplier: plantSupplier[p.id] }));

export const supplierName = (id?: string) =>
	id === 'grown' ? 'Grown here' : suppliers.find((s) => s.id === id)?.name;

/** A sensible first quantity for the reorder form. */
export const defaultReorder = (p: Plant) => (p.category === 'Perennials' ? 24 : p.category === 'Sundries' ? 20 : 10);

/* ---------------------------------------------------------------- Accounts */

/** Trade invoices go out on delivery and are due 14 days later. Not in the module yet. */
export const TRADE_TERMS_DAYS = 14;

/* ------------------------------------------------------------- Formatting */

export const addDays = (iso: string, days: number) => {
	const d = new Date(`${iso}T12:00:00`);
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
};

export const TOMORROW = addDays(TODAY, 1);

/** "Today", "Tomorrow" or "Sat, Oct 24" relative to the demo's today. */
export function relativeDay(iso?: string) {
	if (!iso) return 'Not booked';
	if (iso === TODAY) return 'Today';
	if (iso === TOMORROW) return 'Tomorrow';
	return formatDate(iso);
}

/** "Van 1", "Collection" */
export const methodLabel = (o: Order) => (o.fulfilment === 'collection' ? 'Collection' : (o.van ?? 'Van'));

/** "van tomorrow", "collecting today", "Van 1 on Sat, Oct 24" */
export function whenText(o: Order) {
	const rel = relativeDay(o.due);
	if (!o.due) return 'not booked';
	const how = o.fulfilment === 'collection' ? 'collecting' : (o.van ?? 'van');
	return rel === 'Today' || rel === 'Tomorrow' ? `${how} ${rel.toLowerCase()}` : `${how} on ${rel}`;
}

/** "1 item", "3 items" */
export const itemCount = (o: Order) => {
	const n = orderItems(o);
	return `${n} ${n === 1 ? 'item' : 'items'}`;
};

/** "3 Mill Row, Hollin Bridge" */
export const shortAddress = (c: Customer) => `${c.street}, ${c.town}`;
