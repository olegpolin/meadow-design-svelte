<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { stockBadge, stockState } from '#lib/demos/world.js';
	import type { ShopPlant } from './data.js';

	/* `quiet` skips the "In stock" badge, for lists where most rows are fine. */
	let { plant, quiet = false }: { plant: ShopPlant; quiet?: boolean } = $props();

	const state = $derived(stockState(plant));
</script>

<span class="inline-flex flex-wrap gap-1">
	{#if !(quiet && state === 'In stock')}
		<Badge variant={stockBadge[state]}>{state}</Badge>
	{/if}
	{#if plant.onOrder}
		<!-- Dashboard only: a reorder sent during this visit. -->
		<Badge variant="ghost">On order</Badge>
	{/if}
</span>
