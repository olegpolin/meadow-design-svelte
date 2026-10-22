<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import { delivery, formatTime } from '#lib/demos/world.js';
	import { itemCount, shortAddress, type RunStop } from './data.js';
	import { getShop } from './shop.svelte.js';

	let { headingLevel = 2 }: { headingLevel?: 2 | 3 } = $props();

	const shop = getShop();
	const driver = delivery.todayRun.driver.name.split(' ')[0];
	const total = $derived(shop.run.length);
	const done = $derived(shop.runDone);

	function toggle(stop: RunStop, checked: boolean) {
		shop.setStop(stop, checked);
		if (checked && shop.runDone === shop.run.length) {
			toast.success(`${driver}’s run is done`, { description: `All ${total} stops made on ${delivery.todayRun.van}.` });
		}
	}

	function detail(stop: RunStop) {
		const order = stop.orderId ? shop.find(stop.orderId) : undefined;
		return order ? `${order.id}, ${itemCount(order)}` : stop.what;
	}
</script>

<!--
	Today's van run. Each stop is a label wrapping its checkbox, so the whole
	row toggles it. Ticking a ledger stop marks its order delivered everywhere.
-->
<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
		<svelte:element this={`h${headingLevel}`} id="run-heading" class="display-4">
			{driver}’s run, {delivery.todayRun.van}
		</svelte:element>
		<p class="text-sm tabular-nums" id="run-progress-label">
			{done} of {total} stops done
		</p>
	</div>
	<Progress value={done} max={total} aria-labelledby="run-progress-label" />

	<Item.Group class="mt-1 border-t border-current" aria-labelledby="run-heading">
		{#each shop.run as stop (stop.id)}
			{@const isDone = shop.isDone(stop)}
			<Item.Root size="sm" class="px-0" role="listitem">
				{#snippet child({ props })}
					<label {...props} class={[props.class as string, 'cursor-pointer', isDone && 'text-current/60']}>
						<Checkbox
							checked={isDone}
							onCheckedChange={(v) => toggle(stop, v)}
							aria-label="Stop made at {stop.customer.name}"
						/>
						<span class="w-17 shrink-0 font-display font-bold whitespace-nowrap tabular-nums">{formatTime(stop.time)}</span>
						<Item.Content class="min-w-0">
							<Item.Title class={['w-full truncate', isDone && 'line-through decoration-2']}>
								{stop.customer.name}
							</Item.Title>
							<Item.Description class="text-current/75">
								{shortAddress(stop.customer)}. {detail(stop)}
							</Item.Description>
						</Item.Content>
					</label>
				{/snippet}
			</Item.Root>
		{/each}
	</Item.Group>
</div>
