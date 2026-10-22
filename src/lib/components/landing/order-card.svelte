<script lang="ts">
	import { cn } from '#lib/utils.js';
	import {
		delivery,
		formatLongDate,
		formatMoney,
		order,
		orderDeliveryFee,
		orderTotal
	} from '#lib/demos/world.js';

	/*
	 * Order #4479 from the ledger, laid out as three stacked colour blocks, like
	 * stamps: the plant on the warm block, the price on the cool block, the
	 * delivery on the ink card. Static; it shows the system's surfaces at work.
	 */
	let { class: className }: { class?: string } = $props();

	const o = order('#4479');
	const line = o.lines[0];
	const fee = orderDeliveryFee(o);
	const slot = delivery.slots.find((s) => s.id === o.slot);
	const van = delivery.vans.find((v) => v.name === o.van);
	const driver = van?.driver.name.split(' ')[0];
</script>

<article aria-label="Order {o.id} from Hollin Nursery" class={cn('flex flex-col gap-2.5', className)}>
	<!-- The warm block sits on the warm band, so it carries a hairline to read as its own stamp. -->
	<div class="rounded-lg border bg-secondary p-5 text-secondary-foreground md:p-7">
		<div class="flex items-baseline justify-between gap-4 text-sm">
			<span class="font-display font-bold">Order {o.id}</span>
			<span class="text-right">{o.customer.name}</span>
		</div>
		<p class="display-3 mt-6 md:mt-10">{line.plant.name}</p>
		{#if o.note}
			<p class="mt-2 text-sm md:text-[0.9375rem]">{o.note}</p>
		{/if}
	</div>

	<div class="flex items-end justify-between gap-4 rounded-lg bg-accent p-5 text-accent-foreground md:p-7">
		<div class="text-sm leading-relaxed tabular-nums">
			<p>{line.qty} × {formatMoney(line.plant.price)}</p>
			<p>Delivery {fee === 0 ? 'free' : formatMoney(fee)}</p>
		</div>
		<p class="figure tabular-nums">{formatMoney(orderTotal(o))}</p>
	</div>

	<div class="flex items-end justify-between gap-4 rounded-lg bg-primary p-5 text-primary-foreground md:p-7">
		<div>
			{#if o.due}
				<p class="display-4">{formatLongDate(o.due)}</p>
			{/if}
			{#if slot}
				<p class="mt-1 text-sm">{driver} brings it in the {slot.label.toLowerCase()},
					<span class="whitespace-nowrap">{slot.window}</span></p>
			{/if}
		</div>
		<p class="shrink-0 text-sm">{o.van}</p>
	</div>
</article>
