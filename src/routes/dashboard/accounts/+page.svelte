<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import {
		TODAY,
		formatDate,
		formatLongDate,
		formatMoney,
		formatMonthDay,
		orderTotal,
		staff,
		weeklyTakings,
		weeklyTotal
	} from '#lib/demos/world.js';
	import { TRADE_TERMS_DAYS, type ShopOrder } from '#lib/components/dashboard/data.js';
	import { getShop } from '#lib/components/dashboard/shop.svelte.js';

	const shop = getShop();

	/* The full weeks of October so far (from the module's sales), against the two weeks before. */
	const october = weeklyTakings.filter((w) => w.week >= '2026-10-01');
	const before = weeklyTakings.slice(-october.length * 2, -october.length);
	const sum = (weeks: typeof weeklyTakings) => weeks.reduce((s, w) => s + weeklyTotal(w), 0);
	const octoberSales = sum(october);
	const change = octoberSales - sum(before);
	const lastDay = new Date(`${october.at(-1)!.week}T12:00:00`);
	lastDay.setDate(lastDay.getDate() + 6);
	const octoberEnd = lastDay.toISOString().slice(0, 10);

	const owed = $derived(shop.invoices.reduce((s, i) => s + i.amount, 0));
	const pending = $derived(shop.toInvoice.reduce((s, o) => s + orderTotal(o), 0));

	function remind(order: ShopOrder) {
		shop.remind(order.id);
		toast.success(`Reminder sent for ${order.id}`, {
			description: `${order.customer.name}, ${formatMoney(orderTotal(order))}. ${staff.june.name.split(' ')[0]} is copied in.`
		});
	}
</script>

<svelte:head>
	<title>Accounts · Hollin Nursery</title>
</svelte:head>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-1">
		<h1 class="display-3">Accounts</h1>
		<p class="text-[0.9375rem] text-muted-foreground">
			{staff.june.name} closes the books for October on {formatLongDate('2026-10-31')}.
		</p>
	</div>

	<section class="rounded-block bg-accent p-5 text-accent-foreground md:p-8" aria-labelledby="october-heading">
		<h2 id="october-heading" class="font-display text-[0.9375rem] font-bold">October, full weeks so far</h2>
		<p class="figure mt-2 tabular-nums">{formatMoney(octoberSales)}</p>
		<p class="mt-3 max-w-prose text-[0.9375rem] text-current/85 tabular-nums">
			Sales for the {october.length} full weeks from {formatMonthDay(october[0].week)} to {formatMonthDay(octoberEnd)}, shop,
			website and trade together. That is {change >= 0 ? 'up' : 'down'}
			{formatMoney(Math.abs(change))} on the {before.length} weeks before.
		</p>
	</section>

	<section aria-labelledby="invoices-heading" class="flex flex-col gap-4">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<h2 id="invoices-heading" class="display-4">Unpaid trade invoices</h2>
			<p class="text-sm text-muted-foreground tabular-nums">{formatMoney(owed)} owed</p>
		</div>
		{#if shop.invoices.length > 0}
			<Item.Group class="border-t" aria-labelledby="invoices-heading">
				{#each shop.invoices as invoice (invoice.order.id)}
					{@const overdue = invoice.due < TODAY}
					{@const reminded = shop.reminded.includes(invoice.order.id)}
					<Item.Root size="sm" class="flex-wrap px-0" role="listitem">
						<Item.Content class="min-w-0">
							<Item.Title class="w-full">
								<span class="truncate">{invoice.order.customer.name}</span>
								{#if overdue}<Badge variant="destructive">Overdue</Badge>{/if}
								{#if invoice.due === TODAY}<Badge variant="secondary">Due today</Badge>{/if}
								{#if reminded}<Badge variant="outline">Reminded</Badge>{/if}
							</Item.Title>
							<Item.Description class="tabular-nums">
								Order {invoice.order.id}, sent {formatDate(invoice.issued)}, due {formatDate(invoice.due)}
							</Item.Description>
						</Item.Content>
						<Item.Actions class="gap-4 max-sm:basis-full max-sm:justify-between">
							<span class="font-display font-bold tabular-nums">{formatMoney(invoice.amount)}</span>
							<Button variant="outline" size="xs" disabled={reminded} onclick={() => remind(invoice.order)}>
								{reminded ? 'Sent' : 'Send reminder'}<span class="sr-only">&nbsp;for {invoice.order.id}</span>
							</Button>
						</Item.Actions>
					</Item.Root>
				{/each}
			</Item.Group>
		{:else}
			<p class="border-t pt-4 text-[0.9375rem] text-muted-foreground">Every trade invoice is paid.</p>
		{/if}
		<p class="max-w-prose text-sm text-muted-foreground tabular-nums">
			Trade invoices go out the day an order is delivered and are due {TRADE_TERMS_DAYS} days later.
			{#if shop.toInvoice.length > 0}
				{shop.toInvoice.length} more trade {shop.toInvoice.length === 1 ? 'order' : 'orders'}
				({shop.toInvoice.map((o) => o.id).join(', ')}, {formatMoney(pending)}) {shop.toInvoice.length === 1 ? 'gets its' : 'get their'}
				invoice once delivered.
			{/if}
		</p>
	</section>
</div>
