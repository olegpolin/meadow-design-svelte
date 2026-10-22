<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { parseDate } from '@internationalized/date';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import {
		delivery,
		formatDate,
		formatLongDate,
		formatMoney,
		lineTotal,
		orderDeliveryFee,
		orderSubtotal,
		orderTotal,
		shop as hollin,
		shortcuts,
		statusBadge
	} from '#lib/demos/world.js';
	import { nextStep, waitingOn, type ShopOrder } from './data.js';
	import { getShop } from './shop.svelte.js';

	let { order, open = $bindable(false) }: { order: ShopOrder | undefined; open?: boolean } = $props();

	const shop = getShop();
	let cancelOpen = $state(false);
	let content = $state<HTMLElement | null>(null);

	const step = $derived(order ? nextStep(order) : undefined);
	const waiting = $derived(order && order.status === 'Open' ? waitingOn(order) : undefined);
	const due = $derived(order?.due ? parseDate(order.due) : undefined);
	const van = $derived(order?.van ? delivery.vans.find((v) => v.name === order.van) : undefined);
	const slot = $derived(order?.slot ? delivery.slots.find((s) => s.id === order.slot) : undefined);
	const fee = $derived(order ? orderDeliveryFee(order) : 0);

	function advance() {
		if (!order || !step || waiting) return;
		/* Read the step before the status changes: it is derived from the status. */
		const { id } = order;
		const { to, done } = step;
		const was = order.status;
		shop.setStatus(id, to);
		open = false;
		toast.success(`${id} ${done}`, {
			description: order.customer.name,
			action: { label: 'Undo', onClick: () => shop.setStatus(id, was) }
		});
	}

	function logReturn() {
		if (!order) return;
		const { id } = order;
		shop.logReturn(id, true);
		open = false;
		toast.success(`Return logged for ${id}`, {
			description: `${formatMoney(orderTotal(order))} to refund to ${order.customer.name}.`,
			action: { label: 'Undo', onClick: () => shop.logReturn(id, false) }
		});
	}

	function cancel() {
		if (!order) return;
		const { id } = order;
		const name = order.customer.name;
		const was = order.status;
		const total = orderTotal(order);
		shop.setStatus(id, 'Cancelled');
		cancelOpen = false;
		open = false;
		toast(`${id} cancelled`, {
			description: `${formatMoney(total)} refunded to ${name}.`,
			action: { label: 'Undo', onClick: () => shop.setStatus(id, was) }
		});
	}

	/* Ctrl Enter marks an open order packed while its panel is open. */
	function onkeydown(event: KeyboardEvent) {
		if (!open || cancelOpen || order?.status !== 'Open') return;
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			advance();
		}
	}
</script>

<svelte:window {onkeydown} />

<Sheet.Root bind:open>
	<!-- Focus the panel itself on open, not the calendar's first arrow. -->
	<Sheet.Content
		side="right"
		class="sm:max-w-lg"
		bind:ref={content}
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			content?.focus();
		}}
	>
		{#if order}
			<Sheet.Header>
				<div class="flex items-center gap-3">
					<Sheet.Title>Order {order.id}</Sheet.Title>
					<Badge variant={statusBadge[order.status]}>{order.status}</Badge>
				</div>
				<Sheet.Description>
					{order.customer.name}, placed {formatDate(order.placed)}.{#if order.returned}
						Return logged {formatDate(order.returned)}.{/if}
				</Sheet.Description>
			</Sheet.Header>

			<div class="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 pb-2 md:px-8">
				<dl class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-[0.9375rem]">
					<dt class="text-muted-foreground">Email</dt>
					<dd class="truncate">{order.customer.email}</dd>
					{#if order.customer.phone}
						<dt class="text-muted-foreground">Phone</dt>
						<dd>{order.customer.phone}</dd>
					{/if}
					<dt class="text-muted-foreground">{order.fulfilment === 'delivery' ? 'Deliver to' : 'Pickup'}</dt>
					<dd>
						{#if order.fulfilment === 'delivery'}
							{order.customer.street}, {order.customer.town}, {hollin.address.state} {order.customer.zip}
						{:else}
							{delivery.collection}
						{/if}
					</dd>
				</dl>

				<section aria-labelledby="sheet-lines" class="flex flex-col gap-2">
					<h3 id="sheet-lines" class="font-display font-bold">What they ordered</h3>
					<ul class="border-t">
						{#each order.lines as line (line.plant.id)}
							<li class="flex items-baseline justify-between gap-4 border-b py-3 text-[0.9375rem]">
								<span class="min-w-0">
									{line.plant.name}{line.plant.name.toLowerCase().includes(line.plant.form.toLowerCase()) ? '' : `, ${line.plant.form}`}
									<span class="text-muted-foreground tabular-nums">× {line.qty}</span>
								</span>
								<span class="shrink-0 tabular-nums">{formatMoney(lineTotal(line))}</span>
							</li>
						{/each}
						<li class="flex items-baseline justify-between gap-4 border-b py-3 text-[0.9375rem] text-muted-foreground">
							<span>Subtotal</span>
							<span class="tabular-nums">{formatMoney(orderSubtotal(order))}</span>
						</li>
						<li class="flex items-baseline justify-between gap-4 border-b py-3 text-[0.9375rem] text-muted-foreground">
							<span>
								{order.fulfilment === 'collection'
									? 'Collection'
									: fee === 0
										? `Delivery, free over ${formatMoney(delivery.freeOver)}`
										: 'Delivery'}
							</span>
							<span class="tabular-nums">{fee === 0 ? 'Free' : formatMoney(fee)}</span>
						</li>
					</ul>
					<p class="flex items-baseline justify-between font-display text-lg font-extrabold">
						<span>Total</span>
						<span class="tabular-nums">{formatMoney(orderTotal(order))}</span>
					</p>
				</section>

				<section aria-labelledby="sheet-due" class="flex flex-col gap-2">
					<h3 id="sheet-due" class="font-display font-bold">
						{#if !order.due}
							Not booked
						{:else if order.fulfilment === 'delivery'}
							{order.van ?? 'Van'}, {formatLongDate(order.due)}
						{:else}
							Collecting {formatLongDate(order.due)}
						{/if}
					</h3>
					<p class="text-[0.9375rem] text-muted-foreground">
						{#if !order.due}
							This order never got a delivery day.
						{:else if order.fulfilment === 'delivery'}
							{slot ? `${slot.label} slot, ${slot.window}` : 'Slot not set yet'}{van ? `, with ${van.driver.name}` : ''}.
							{#if waiting}Waiting on {waiting.name}, which arrives {formatDate(waiting.arrives!)}.{/if}
						{:else}
							From the yard gate, {hollin.hours}.
						{/if}
					</p>
					{#if due}
						<Calendar
							type="single"
							value={due}
							placeholder={due}
							readonly
							class="-ml-3 p-0 pt-2"
							aria-label="{order.fulfilment === 'delivery' ? 'Delivery' : 'Collection'} day"
						/>
					{/if}
				</section>

				<section aria-labelledby="sheet-notes" class="flex flex-col gap-2">
					<h3 id="sheet-notes" class="font-display font-bold">Notes</h3>
					<p class={['text-[0.9375rem]', !order.note && 'text-muted-foreground']}>
						{order.note ?? 'No notes on this order.'}
					</p>
				</section>
			</div>

			<Sheet.Footer class="flex-col-reverse border-t sm:flex-row sm:justify-end">
				{#if order.status === 'Open' || order.status === 'Packed'}
					<AlertDialog.Root bind:open={cancelOpen}>
						<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Cancel order</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Cancel order {order.id}?</AlertDialog.Title>
								<AlertDialog.Description>
									{order.customer.name} gets {formatMoney(orderTotal(order))} back on their card and the plants go back on the bench.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Keep order</AlertDialog.Cancel>
								<AlertDialog.Action variant="destructive" onclick={cancel}>Cancel order</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{:else}
					<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
				{/if}
				{#if step}
					<Button onclick={advance} disabled={!!waiting}>
						{waiting ? 'Waiting on stock' : step.label}
						{#if order.status === 'Open' && !waiting}
							<Kbd.Group class="max-sm:hidden" aria-hidden="true">
								{#each shortcuts.markPacked.keys as key (key)}<Kbd.Root>{key}</Kbd.Root>{/each}
							</Kbd.Group>
						{/if}
					</Button>
				{:else if order.status === 'Delivered'}
					{#if order.returned}
						<Button variant="outline" onclick={() => order && shop.logReturn(order.id, false)}>Undo return</Button>
					{:else}
						<Button variant="outline" onclick={logReturn}>Log a return</Button>
					{/if}
				{/if}
			</Sheet.Footer>
		{:else}
			<Sheet.Header>
				<Sheet.Title>Order not found</Sheet.Title>
				<Sheet.Description>It may have been cancelled. Pick another order from the list.</Sheet.Description>
			</Sheet.Header>
		{/if}
	</Sheet.Content>
</Sheet.Root>
