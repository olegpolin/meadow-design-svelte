/**
 * Demo data for the Data catalog page and the dashboard, in the shapes those
 * demos already use. Every value is derived from the shared world module
 * (`#lib/demos/world.js`), so an order, a price or a week of takings reads the
 * same here as on every other page.
 */

import {
	formatDate,
	formatMoney,
	octoberRuns,
	order as ledgerOrder,
	orderDeliveryFee,
	orderItems,
	orderTotal,
	orders as ledger,
	plantList,
	statusBadge,
	topPlants as worldTopPlants,
	weeklyTakings,
	weeklyTotal,
	type OrderStatus as WorldOrderStatus
} from '#lib/demos/world.js';

export { formatMoney };
/** "Thu, Oct 22" from an ISO date. */
export const formatDay = formatDate;

const toDate = (iso: string) => new Date(`${iso}T12:00:00`);

// ------------------------------------------------------------------ orders

export type OrderStatus = WorldOrderStatus;

/** One badge treatment per status; the label always carries the meaning too. */
export const statusVariant = statusBadge;

export type Order = {
	id: string;
	customer: string;
	/** ISO date the order was placed, e.g. 2026-10-21. */
	date: string;
	items: number;
	status: OrderStatus;
	total: number;
};

/** The ledger, #4468 to #4483, oldest first. */
export const orders: Order[] = ledger.map((o) => ({
	id: o.id,
	customer: o.customer.name,
	date: o.placed,
	items: orderItems(o),
	status: o.status,
	total: orderTotal(o)
}));

/** Order #4476, line by line, for the table with footer totals. Delivery is free over $60. */
export const invoiceOrder = ledgerOrder('#4476');
export const invoiceLines = invoiceOrder.lines.map((l) => ({
	item: `${l.plant.name}, ${l.plant.form}`,
	qty: l.qty,
	price: l.plant.price
}));
export const invoiceDelivery = orderDeliveryFee(invoiceOrder);

// ------------------------------------------------------------------ stock

export type StockItem = {
	plant: string;
	location: string;
	inStock: number;
	reserved: number;
	price: number;
};

export const stock: StockItem[] = plantList.map((p) => ({
	plant: p.name,
	location: p.location,
	inStock: p.stock,
	reserved: p.reserved,
	price: p.price
}));

// ------------------------------------------------------------------ sales

/** Takings by category for the 12 full weeks before today, each starting on a Monday. */
export const weeklySales = weeklyTakings.map((w) => ({
	week: toDate(w.week),
	perennials: w.perennials,
	shrubs: w.shrubs,
	sundries: w.sundries
}));

/** Total takings for the same 12 weeks. */
export const recentTakings = weeklyTakings.map((w) => ({
	week: toDate(w.week),
	takings: weeklyTotal(w)
}));

/** Van runs so far in October (Tuesday, Thursday, Saturday), with the stops made on each. */
export const deliveryRuns = octoberRuns.map((r) => ({ date: toDate(r.date), stops: r.stops }));

/** @deprecated Old name, kept so nothing breaks: one entry per van run, not per day. */
export const dailyDeliveries = octoberRuns.map((r) => ({ date: toDate(r.date), deliveries: r.stops }));

/** Units sold so far in October, best first. */
export const topPlants = worldTopPlants.map((t) => ({ plant: t.plant.name, units: t.units }));
