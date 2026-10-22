/**
 * Hollin Nursery: the one fictional world every demo on the site draws from.
 *
 * A small plant nursery and garden shop in Hollin Bridge, a river town in
 * Massachusetts. Today is Thursday, October 22, 2026. Everything here is the
 * source of truth: prices, stock, the order ledger, the delivery rules, the
 * cast and the keyboard shortcuts. Pages import from this module instead of
 * inventing their own numbers, so an order has the same customer, lines and
 * total on every page it appears on.
 *
 * Locale: US. Dollars, miles, degrees Fahrenheit, 12-hour times, dates as
 * "Thursday, October 22" or "Thu, Oct 22".
 */

import type { BadgeVariant } from '#lib/components/ui/badge/index.js';

// ------------------------------------------------------------------ time

/** Thursday, October 22, 2026. */
export const TODAY = '2026-10-22';
export const today = () => new Date(`${TODAY}T12:00:00`);

const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const toDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);

/** "Thursday, October 22" */
export const formatLongDate = (iso: string) => longDate.format(toDate(iso));
/** "Thu, Oct 22" */
export const formatDate = (iso: string) => shortDate.format(toDate(iso));
/** "Oct 22" */
export const formatMonthDay = (iso: string) => monthDay.format(toDate(iso));
/** "9:00 AM" */
export const formatTime = (iso: string) => time.format(toDate(iso));
/** "$43.50" */
export const formatMoney = (n: number) => money.format(n);

// ------------------------------------------------------------------ shop

export const shop = {
	name: 'Hollin Nursery',
	tagline: 'Plants, trees and advice, grown by the river.',
	address: { street: '12 Wharf Lane', town: 'Hollin Bridge', state: 'MA', zip: '01749' },
	phone: '(978) 240-6617',
	email: 'hello@hollinnursery.com',
	/** Open Tuesday to Sunday. */
	hours: 'Tuesday to Sunday, 9:00 AM to 5:00 PM',
	closedDays: ['Monday'],
	/** Sales tax applied at the till. */
	taxRate: 0.0625
} as const;

export const weather = {
	/** Tonight's forecast, the reason for the frost warnings across the site. */
	frostWarning: 'Frost tonight, down to 27°F. Move the hellebores and young foxgloves into tunnel 1 before you close up.',
	frostLow: '27°F',
	source: 'the National Weather Service'
} as const;

// ------------------------------------------------------------------ people

export type Person = {
	id: string;
	name: string;
	initials: string;
	role: string;
	email: string;
};

export const staff = {
	nell: { id: 'nell', name: 'Nell Okafor', initials: 'NO', role: 'Owner', email: 'nell@hollinnursery.com' },
	tomasz: { id: 'tomasz', name: 'Tomasz Brandt', initials: 'TB', role: 'Grower', email: 'tomasz@hollinnursery.com' },
	priya: { id: 'priya', name: 'Priya Ramaswamy', initials: 'PR', role: 'Deliveries', email: 'priya@hollinnursery.com' },
	june: { id: 'june', name: 'June Castellanos', initials: 'JC', role: 'Accounts', email: 'june@hollinnursery.com' }
} as const satisfies Record<string, Person>;

export const staffList: Person[] = Object.values(staff);

export type Customer = {
	id: string;
	name: string;
	initials: string;
	/** Street address in or near Hollin Bridge. */
	street: string;
	town: string;
	zip: string;
	email: string;
	phone?: string;
	/** Trade customers buy in bulk and get an invoice. */
	trade?: boolean;
};

export const customers = {
	hal: { id: 'hal', name: 'Hal Jennings', initials: 'HJ', street: '14 Ferry Lane', town: 'Hollin Bridge', zip: '01749', email: 'hal.jennings@gmail.com', phone: '(978) 240-3318' },
	marguerite: { id: 'marguerite', name: 'Marguerite Lowe', initials: 'ML', street: '3 Mill Row', town: 'Hollin Bridge', zip: '01749', email: 'mlowe@outlook.com', phone: '(978) 240-7724' },
	dev: { id: 'dev', name: 'Dev Anand', initials: 'DA', street: 'The Quay Café, 1 Quay Street', town: 'Hollin Bridge', zip: '01749', email: 'dev@thequaycafe.com', trade: true },
	rosa: { id: 'rosa', name: 'Rosa Lindqvist', initials: 'RL', street: '27 Orchard Street', town: 'Hollin Bridge', zip: '01749', email: 'rosa.lindqvist@icloud.com', phone: '(978) 240-5190' },
	ottilie: { id: 'ottilie', name: 'Ottilie Marsh', initials: 'OM', street: '8 Weir Cottages', town: 'Stow', zip: '01775', email: 'ottilie.marsh@gmail.com' },
	bram: { id: 'bram', name: 'Bram Kowalczyk', initials: 'BK', street: '112 Hudson Road', town: 'Hollin Bridge', zip: '01749', email: 'bram.k@proton.me' },
	samir: { id: 'samir', name: 'Samir Haddad', initials: 'SH', street: '40 Chapel Street', town: 'Bolton', zip: '01740', email: 'samir.haddad@gmail.com' },
	cora: { id: 'cora', name: 'Cora Whitlock', initials: 'CW', street: '5 Lower Green', town: 'Hollin Bridge', zip: '01749', email: 'cora@whitlockgardens.com', trade: true },
	ines: { id: 'ines', name: 'Ines Farrow', initials: 'IF', street: '19 Station Road', town: 'Hollin Bridge', zip: '01749', email: 'ines.farrow@yahoo.com' },
	allotments: { id: 'allotments', name: 'Riverside Allotment Society', initials: 'RA', street: 'Riverside Allotments, Meadow Lane', town: 'Hollin Bridge', zip: '01749', email: 'plots@riversideallotments.org', trade: true },
	lockkeeper: { id: 'lockkeeper', name: 'The Lock Keeper’s Café', initials: 'LK', street: 'Lock House, Canal Path', town: 'Hollin Bridge', zip: '01749', email: 'orders@lockkeeperscafe.com', trade: true }
} as const satisfies Record<string, Customer>;

export const customerList: Customer[] = Object.values(customers);

// ------------------------------------------------------------------ plants

export type PlantCategory = 'Perennials' | 'Shrubs' | 'Trees' | 'Sundries';

export type Plant = {
	id: string;
	/** Display name, with the cultivar in curly quotes. */
	name: string;
	category: PlantCategory;
	/** Pot or form, e.g. "2 L pot". */
	form: string;
	price: number;
	/** Units in stock today. 0 with `arrives` set means pre-order. */
	stock: number;
	reserved: number;
	location: string;
	/** ISO date the next batch lands, for pre-orders. */
	arrives?: string;
	/** One line of care advice. */
	care: string;
};

export const plants = {
	hellebore: { id: 'hellebore', name: 'Hellebore ‘Ice n’ Roses’', category: 'Perennials', form: '2 L pot', price: 18.5, stock: 38, reserved: 6, location: 'Shade house', care: 'Part shade, rich soil. Cut the old leaves back in December; flowers December to April.' },
	foxglove: { id: 'foxglove', name: 'Foxglove ‘Pam’s Choice’', category: 'Perennials', form: '9 cm pot', price: 7.25, stock: 112, reserved: 24, location: 'Polytunnel 2', care: 'Sun or part shade. Biennial: leaves this year, flowers next June.' },
	seaHolly: { id: 'sea-holly', name: 'Sea holly', category: 'Perennials', form: '1 L pot', price: 9.8, stock: 27, reserved: 2, location: 'Bed C', care: 'Full sun and poor, free-draining soil. Hates wet feet in winter.' },
	witchHazel: { id: 'witch-hazel', name: 'Witch hazel', category: 'Shrubs', form: '5 L pot', price: 42, stock: 9, reserved: 3, location: 'Tree row', care: 'Sun or part shade, neutral to acid soil. Scented flowers in January.' },
	bronzeFennel: { id: 'bronze-fennel', name: 'Bronze fennel', category: 'Perennials', form: '1 L pot', price: 5.4, stock: 54, reserved: 0, location: 'Bed A', care: 'Full sun. Seeds itself everywhere; cut the heads off in August if you want fewer.' },
	hosta: { id: 'hosta', name: 'Hosta ‘Patriot’', category: 'Perennials', form: '2 L pot', price: 12.75, stock: 0, reserved: 0, location: 'Shade house', arrives: '2027-03-15', care: 'Shade and moisture. Sold out until spring.' },
	lavender: { id: 'lavender', name: 'Lavender ‘Hidcote’', category: 'Perennials', form: '9 cm pot', price: 5.9, stock: 140, reserved: 20, location: 'Polytunnel 1', care: 'Full sun, sharp drainage. Trim after flowering, never into old wood.' },
	dogwood: { id: 'dogwood', name: 'Dogwood ‘Midwinter Fire’', category: 'Shrubs', form: '3 L pot', price: 24.5, stock: 11, reserved: 1, location: 'Tree row', care: 'Any soil, full sun for the best stem colour. Cut hard in March.' },
	rose: { id: 'rose', name: 'Bare-root rose ‘Gertrude Jekyll’', category: 'Shrubs', form: 'Bare-root', price: 21.75, stock: 0, reserved: 9, location: 'Cold store', arrives: '2026-11-10', care: 'Pre-order. Plant within a week of delivery; heel in if the ground is frozen.' },
	apple: { id: 'apple', name: 'Apple ‘Discovery’', category: 'Trees', form: 'Bare-root, 2 year', price: 34, stock: 0, reserved: 4, location: 'Cold store', arrives: '2026-11-17', care: 'Pre-order. Early eater, ripe in late August. Needs a pollination partner nearby.' },
	compost: { id: 'compost', name: 'Peat-free compost', category: 'Sundries', form: '40 L bag', price: 9.9, stock: 60, reserved: 11, location: 'Yard', care: 'Keep the bags out of the rain.' }
} as const satisfies Record<string, Plant>;

export const plantList: Plant[] = Object.values(plants);

/** "Low" is at or under 12 units; pre-orders are "Pre-order"; 0 with no date is "Sold out". */
export type StockState = 'In stock' | 'Low' | 'Pre-order' | 'Sold out';
export function stockState(plant: Plant): StockState {
	if (plant.stock === 0) return plant.arrives && plant.arrives <= '2026-12-31' ? 'Pre-order' : 'Sold out';
	return plant.stock <= 12 ? 'Low' : 'In stock';
}
export const stockBadge: Record<StockState, BadgeVariant> = {
	'In stock': 'outline',
	Low: 'secondary',
	'Pre-order': 'accent',
	'Sold out': 'destructive'
};

// ------------------------------------------------------------------ delivery

export const delivery = {
	/** Van runs go out on these days. */
	days: ['Tuesday', 'Thursday', 'Saturday'] as const,
	/** Two slots a run. */
	slots: [
		{ id: 'am', label: 'Morning', window: '9:00 AM to 12:00 PM' },
		{ id: 'pm', label: 'Afternoon', window: '1:00 PM to 4:30 PM' }
	],
	radiusMiles: 12,
	/** Charged on orders under the threshold; free above it. */
	fee: 6.5,
	freeOver: 60,
	vans: [
		{ id: 'van-1', name: 'Van 1', driver: staff.priya },
		{ id: 'van-2', name: 'Van 2', driver: staff.tomasz }
	],
	/** Pick-up from the yard gate, any open day. */
	collection: 'Collect from the yard gate, any open day, free.',
	/** Today's run: Priya, Van 1, out since 8:30 AM. */
	todayRun: { driver: staff.priya, van: 'Van 1', left: '2026-10-22T08:30:00', stops: 7 },
	/** The next three runs after today. */
	nextRuns: ['2026-10-24', '2026-10-27', '2026-10-29']
} as const;

export const deliveryFee = (subtotal: number) => (subtotal >= delivery.freeOver ? 0 : delivery.fee);

// ------------------------------------------------------------------ orders

export type OrderStatus = 'Open' | 'Packed' | 'Out for delivery' | 'Delivered' | 'Cancelled';

/** One badge treatment per status, everywhere. The label always carries the meaning too. */
export const statusBadge: Record<OrderStatus, BadgeVariant> = {
	Open: 'outline',
	Packed: 'secondary',
	'Out for delivery': 'accent',
	Delivered: 'default',
	Cancelled: 'destructive'
};

export type OrderLine = { plant: Plant; qty: number };

export type Order = {
	/** "#4479" */
	id: string;
	customer: Customer;
	/** ISO date the order was placed. */
	placed: string;
	status: OrderStatus;
	lines: OrderLine[];
	/** 'delivery' uses the van; 'collection' is picked up at the yard gate. */
	fulfilment: 'delivery' | 'collection';
	/** Planned (or actual) delivery or collection date. */
	due?: string;
	slot?: 'am' | 'pm';
	van?: 'Van 1' | 'Van 2';
	note?: string;
};

const L = (plant: Plant, qty: number): OrderLine => ({ plant, qty });

export const orders: Order[] = [
	{ id: '#4468', customer: customers.cora, placed: '2026-10-06', status: 'Delivered', fulfilment: 'delivery', due: '2026-10-08', slot: 'am', van: 'Van 1', lines: [L(plants.witchHazel, 2), L(plants.compost, 1)] },
	{ id: '#4469', customer: customers.bram, placed: '2026-10-08', status: 'Cancelled', fulfilment: 'delivery', lines: [L(plants.seaHolly, 4)], note: 'Cancelled by the customer on October 9; refunded in full.' },
	{ id: '#4470', customer: customers.ottilie, placed: '2026-10-10', status: 'Delivered', fulfilment: 'delivery', due: '2026-10-13', slot: 'pm', van: 'Van 1', lines: [L(plants.lavender, 6), L(plants.hellebore, 1)] },
	{ id: '#4471', customer: customers.hal, placed: '2026-10-13', status: 'Open', fulfilment: 'delivery', due: '2026-11-12', slot: 'am', van: 'Van 1', lines: [L(plants.rose, 3)], note: 'Pre-order. The roses land on November 10; deliver on the first run after.' },
	{ id: '#4472', customer: customers.lockkeeper, placed: '2026-10-14', status: 'Delivered', fulfilment: 'delivery', due: '2026-10-15', slot: 'am', van: 'Van 2', lines: [L(plants.lavender, 12), L(plants.bronzeFennel, 3)] },
	{ id: '#4473', customer: customers.dev, placed: '2026-10-15', status: 'Delivered', fulfilment: 'collection', due: '2026-10-16', lines: [L(plants.hellebore, 1)] },
	{ id: '#4474', customer: customers.marguerite, placed: '2026-10-16', status: 'Out for delivery', fulfilment: 'delivery', due: '2026-10-22', slot: 'am', van: 'Van 1', lines: [L(plants.witchHazel, 2), L(plants.foxglove, 4)], note: 'Leave by the side gate if nobody is in.' },
	{ id: '#4475', customer: customers.samir, placed: '2026-10-17', status: 'Packed', fulfilment: 'delivery', due: '2026-10-24', slot: 'pm', van: 'Van 1', lines: [L(plants.seaHolly, 2), L(plants.lavender, 3)] },
	{ id: '#4476', customer: customers.allotments, placed: '2026-10-17', status: 'Packed', fulfilment: 'delivery', due: '2026-10-24', slot: 'am', van: 'Van 2', lines: [L(plants.foxglove, 20), L(plants.compost, 10)], note: 'Invoice the society; plot 14 takes the compost.' },
	{ id: '#4477', customer: customers.ines, placed: '2026-10-18', status: 'Open', fulfilment: 'delivery', due: '2026-11-19', slot: 'pm', van: 'Van 1', lines: [L(plants.apple, 1)], note: 'Pre-order. Tree arrives November 17.' },
	{ id: '#4478', customer: customers.bram, placed: '2026-10-20', status: 'Open', fulfilment: 'delivery', due: '2026-10-24', slot: 'am', van: 'Van 1', lines: [L(plants.hellebore, 3), L(plants.bronzeFennel, 2)] },
	{ id: '#4479', customer: customers.marguerite, placed: '2026-10-21', status: 'Open', fulfilment: 'delivery', due: '2026-10-27', slot: 'am', van: 'Van 1', lines: [L(plants.hellebore, 2)], note: 'Two plants in 2 L pots, in bud.' },
	{ id: '#4480', customer: customers.dev, placed: '2026-10-21', status: 'Open', fulfilment: 'delivery', due: '2026-10-27', slot: 'am', van: 'Van 2', lines: [L(plants.lavender, 8), L(plants.seaHolly, 4)], note: 'For the café planters. Invoice at month end.' },
	{ id: '#4481', customer: customers.rosa, placed: '2026-10-22', status: 'Open', fulfilment: 'collection', due: '2026-10-23', lines: [L(plants.witchHazel, 1), L(plants.hellebore, 2), L(plants.compost, 1)] },
	{ id: '#4482', customer: customers.hal, placed: '2026-10-22', status: 'Open', fulfilment: 'delivery', due: '2026-10-24', slot: 'pm', van: 'Van 1', lines: [L(plants.foxglove, 6), L(plants.lavender, 2)] },
	{ id: '#4483', customer: customers.ottilie, placed: '2026-10-22', status: 'Open', fulfilment: 'delivery', due: '2026-10-27', slot: 'pm', van: 'Van 1', lines: [L(plants.dogwood, 1)] }
];

/** The number the next order will get. */
export const NEXT_ORDER_ID = '#4484';

export const orderById = (id: string) => orders.find((o) => o.id === id);
export const order = (id: string): Order => {
	const found = orderById(id);
	if (!found) throw new Error(`No order ${id} in the ledger`);
	return found;
};

export const lineTotal = (line: OrderLine) => line.plant.price * line.qty;
export const orderSubtotal = (o: Order) => o.lines.reduce((sum, l) => sum + lineTotal(l), 0);
export const orderDeliveryFee = (o: Order) => (o.fulfilment === 'delivery' ? deliveryFee(orderSubtotal(o)) : 0);
export const orderTotal = (o: Order) => Math.round((orderSubtotal(o) + orderDeliveryFee(o)) * 100) / 100;
export const orderItems = (o: Order) => o.lines.reduce((n, l) => n + l.qty, 0);
/** "2 × Hellebore ‘Ice n’ Roses’, 4 × Foxglove ‘Pam’s Choice’" */
export const orderSummary = (o: Order) => o.lines.map((l) => `${l.qty} × ${l.plant.name}`).join(', ');

// Totals, for reference (computed from the lines above):
// #4468 $93.90 · #4469 $45.70 · #4470 $60.40 · #4471 $65.25 · #4472 $87.00 · #4473 $18.50
// #4474 $113.00 · #4475 $43.80 · #4476 $244.00 · #4477 $40.50 · #4478 $66.30 · #4479 $43.50
// #4480 $86.40 · #4481 $88.90 · #4482 $61.80 · #4483 $31.00

// ------------------------------------------------------------------ sales

/**
 * Takings by category for the 12 full weeks before today, each starting on a
 * Monday (July 27 to October 12). Two dips: the heat wave in the week of
 * August 17 and the wet weekend of September 26 and 27 (the week of the 21st).
 */
export const weeklyTakings = [
	{ week: '2026-07-27', perennials: 1842.6, shrubs: 912.3, sundries: 663.7 },
	{ week: '2026-08-03', perennials: 1718.35, shrubs: 848.9, sundries: 560.1 },
	{ week: '2026-08-10', perennials: 1497.4, shrubs: 731.5, sundries: 456.0 },
	{ week: '2026-08-17', perennials: 1108.85, shrubs: 606.25, sundries: 576.05 },
	{ week: '2026-08-24', perennials: 1662.3, shrubs: 814.6, sundries: 499.5 },
	{ week: '2026-08-31', perennials: 1904.7, shrubs: 936.4, sundries: 511.65 },
	{ week: '2026-09-07', perennials: 2131.25, shrubs: 1122.8, sundries: 587.15 },
	{ week: '2026-09-14', perennials: 2240.9, shrubs: 1279.15, sundries: 587.6 },
	{ week: '2026-09-21', perennials: 1946.35, shrubs: 1012.7, sundries: 729.25 },
	{ week: '2026-09-28', perennials: 2318.6, shrubs: 1404.25, sundries: 670.0 },
	{ week: '2026-10-05', perennials: 2391.45, shrubs: 1487.6, sundries: 736.05 },
	{ week: '2026-10-12', perennials: 2087.2, shrubs: 1258.3, sundries: 608.95 }
];

export const weeklyTotal = (w: (typeof weeklyTakings)[number]) => Math.round((w.perennials + w.shrubs + w.sundries) * 100) / 100;

/** Stops made on each van run so far in October (Tuesday, Thursday, Saturday). */
export const octoberRuns = [
	{ date: '2026-10-01', stops: 9 },
	{ date: '2026-10-03', stops: 12 },
	{ date: '2026-10-06', stops: 7 },
	{ date: '2026-10-08', stops: 11 },
	{ date: '2026-10-10', stops: 14 },
	{ date: '2026-10-13', stops: 6 },
	{ date: '2026-10-15', stops: 10 },
	{ date: '2026-10-17', stops: 15 },
	{ date: '2026-10-20', stops: 8 }
];

/** Units sold so far in October, best first. */
export const topPlants = [
	{ plant: plants.lavender, units: 214 },
	{ plant: plants.hellebore, units: 167 },
	{ plant: plants.foxglove, units: 152 },
	{ plant: plants.seaHolly, units: 74 },
	{ plant: plants.bronzeFennel, units: 58 },
	{ plant: plants.witchHazel, units: 41 }
];

/** Autumn stock take: plants counted on Tuesday, October 20 by Tomasz. */
export const stockTake = { date: '2026-10-20', by: staff.tomasz, counted: 1284, skipped: 3 };

// ------------------------------------------------------------------ app

/** Keyboard shortcuts in the shop admin. One map for every menu and kbd. */
export const shortcuts = {
	search: { keys: ['Ctrl', 'K'], label: 'Search' },
	newOrder: { keys: ['Ctrl', 'N'], label: 'New order' },
	print: { keys: ['Ctrl', 'P'], label: 'Print label' },
	save: { keys: ['Ctrl', 'S'], label: 'Save' },
	sidebar: { keys: ['Ctrl', 'B'], label: 'Toggle sidebar' },
	markPacked: { keys: ['Ctrl', 'Enter'], label: 'Mark packed' }
} as const;
