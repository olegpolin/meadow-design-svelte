import { createContext } from 'svelte';
import { TODAY, delivery, orderTotal, stockState, type OrderStatus, type PlantCategory, type StockState } from '#lib/demos/world.js';
import {
	TRADE_TERMS_DAYS,
	addDays,
	extraStops,
	seedOrders,
	seedPlants,
	stopTimes,
	waitingOn,
	type RunStop,
	type ShopOrder,
	type ShopPlant
} from './data.js';

export type Invoice = { order: ShopOrder; issued: string; due: string; amount: number };

/* Low first (fewest left at the top), then sold out, then pre-orders. */
const watchOrder: Record<StockState, number> = { Low: 0, 'Sold out': 1, 'Pre-order': 2, 'In stock': 3 };

/**
 * In-memory state for the dashboard demo, shared by every dashboard route
 * through context so a stop ticked off on Today shows as delivered on Orders.
 * It starts from the world module's ledger and plants; nothing is saved, so a
 * reload starts the morning again.
 */
export class Shop {
	orders = $state<ShopOrder[]>(structuredClone(seedOrders));
	plants = $state<ShopPlant[]>(structuredClone(seedPlants));
	/** Ids of the run stops that are not ledger orders and are done. */
	stopsDone = $state<string[]>(extraStops.filter((s) => s.done).map((s) => s.id));
	/** Order ids of invoices a reminder went out for. */
	reminded = $state<string[]>([]);
	/** Orders packed during this visit, newest first, for the Today page. */
	packedNow = $state<string[]>([]);

	/** Priya's run today: the ledger orders on her van plus the extra stops, in time order. */
	run = $derived.by(() => {
		const ledger: RunStop[] = this.orders
			.filter(
				(o) =>
					o.due === TODAY && o.van === delivery.todayRun.van && o.fulfilment === 'delivery' && o.status !== 'Cancelled'
			)
			.map((o) => ({ id: o.id, time: stopTimes[o.id] ?? `${TODAY}T12:00:00`, customer: o.customer, orderId: o.id }));
		return [...ledger, ...extraStops].sort((a, b) => a.time.localeCompare(b.time));
	});
	runDone = $derived(this.run.filter((s) => this.isDone(s)).length);

	/** Open orders that can be packed now; pre-orders wait for their stock. */
	toPack = $derived(this.orders.filter((o) => o.status === 'Open' && !waitingOn(o)));

	/** Plants that are not simply in stock: low, sold out or on pre-order. */
	watchList = $derived(
		this.plants
			.filter((p) => stockState(p) !== 'In stock')
			.sort((a, b) => watchOrder[stockState(a)] - watchOrder[stockState(b)] || a.stock - b.stock)
	);

	/** Unpaid trade invoices: one per delivered trade order, raised on the day it went out. */
	invoices = $derived<Invoice[]>(
		this.orders
			.filter((o) => o.customer.trade && o.status === 'Delivered' && !o.returned)
			.map((o) => {
				const issued = o.deliveredAt ?? o.due ?? TODAY;
				return { order: o, issued, due: addDays(issued, TRADE_TERMS_DAYS), amount: orderTotal(o) };
			})
			.sort((a, b) => a.due.localeCompare(b.due))
	);

	/** Trade orders not delivered yet: they get an invoice when they go out. */
	toInvoice = $derived(
		this.orders.filter((o) => o.customer.trade && o.status !== 'Delivered' && o.status !== 'Cancelled')
	);

	isDone(stop: RunStop) {
		return stop.orderId ? this.find(stop.orderId)?.status === 'Delivered' : this.stopsDone.includes(stop.id);
	}

	setStop(stop: RunStop, done: boolean) {
		if (stop.orderId) {
			this.setStatus(stop.orderId, done ? 'Delivered' : 'Out for delivery');
		} else {
			this.stopsDone = done ? [...this.stopsDone, stop.id] : this.stopsDone.filter((id) => id !== stop.id);
		}
	}

	byStatus(status: OrderStatus) {
		return this.orders.filter((o) => o.status === status);
	}

	find(id: string) {
		return this.orders.find((o) => o.id === id);
	}

	setStatus(id: string, status: OrderStatus) {
		const order = this.find(id);
		if (!order) return;
		const was = order.status;
		order.status = status;
		if (status === 'Packed' && was === 'Open') {
			order.packedAt = TODAY;
			this.packedNow.unshift(id);
		}
		if (status === 'Open') {
			order.packedAt = undefined;
			this.packedNow = this.packedNow.filter((p) => p !== id);
		}
		if (status === 'Delivered' && was !== 'Delivered') order.deliveredAt = TODAY;
		if (status !== 'Delivered') order.deliveredAt = undefined;
	}

	logReturn(id: string, on: boolean) {
		const order = this.find(id);
		if (order) order.returned = on ? TODAY : undefined;
	}

	remind(id: string) {
		if (!this.reminded.includes(id)) this.reminded.push(id);
	}

	reorder(plantId: string, qty: number, supplier: string) {
		const plant = this.plants.find((p) => p.id === plantId);
		if (!plant) return;
		plant.onOrder = (plant.onOrder ?? 0) + qty;
		plant.supplier = supplier;
	}

	addPlant(plant: Omit<ShopPlant, 'id'>) {
		const base = plant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'plant';
		let id = base;
		for (let n = 2; this.plants.some((p) => p.id === id); n++) id = `${base}-${n}`;
		this.plants.push({ ...plant, id });
		return id;
	}

	plantsIn(category: PlantCategory | 'all') {
		return category === 'all' ? this.plants : this.plants.filter((p) => p.category === category);
	}
}

const [getShop, setShop] = createContext<Shop>();

export { getShop, setShop };
