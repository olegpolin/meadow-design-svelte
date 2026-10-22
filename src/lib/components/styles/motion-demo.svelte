<script lang="ts">
	import { tick } from 'svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import { customers, formatMoney, order, orderSummary, orderTotal } from '#lib/demos/world.js';

	/**
	 * The two motion speeds side by side: the order row tints in 150ms (a
	 * routine state change) and the note fades in over a scrim in 200ms (an
	 * overlay). Ease-out on the way in, ease-in on the way out.
	 */
	const customer = customers.marguerite;
	// Her open order, then the one Priya has on the van today, which carries a note.
	const plain = order('#4479');
	const noted = order('#4474');

	let open = $state(false);
	let trigger = $state<HTMLButtonElement | null>(null);
	let close = $state<HTMLButtonElement | null>(null);

	async function show() {
		open = true;
		// Move focus into the note once it is no longer inert.
		await tick();
		close?.focus();
	}

	function hide() {
		open = false;
		trigger?.focus();
	}
</script>

<div
	class="relative isolate overflow-hidden rounded-lg border"
	role="presentation"
	onkeydown={(e) => {
		if (open && e.key === 'Escape') hide();
	}}
>
	<div class="flex flex-col gap-1 border-b px-5 py-4 md:px-6">
		<p class="font-display text-sm font-bold">{customer.name}</p>
		<p class="text-sm text-muted-foreground">{customer.street}, {customer.town}</p>
	</div>
	<ul>
		<li class="flex items-center justify-between gap-4 border-b px-5 py-4 md:px-6">
			<span class="min-w-0">
				<span class="block font-display font-bold">{plain.id}, {plain.status}</span>
				<span class="block text-sm text-muted-foreground">{orderSummary(plain)}</span>
			</span>
			<span class="text-sm tabular-nums">{formatMoney(orderTotal(plain))}</span>
		</li>
		<li
			class={cn(
				'flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-[background-color] duration-150 md:px-6',
				open ? 'bg-secondary ease-out' : 'ease-in'
			)}
		>
			<span class="min-w-0">
				<span class="block font-display font-bold">{noted.id}, {noted.status}</span>
				<span class="block text-sm text-muted-foreground">
					{orderSummary(noted)} · {formatMoney(orderTotal(noted))}
				</span>
			</span>
			<Button
				bind:ref={trigger}
				size="sm"
				variant="outline"
				aria-expanded={open}
				aria-controls="motion-note"
				onclick={() => (open ? hide() : show())}
			>
				Show delivery note
			</Button>
		</li>
	</ul>

	<div
		class={cn(
			'absolute inset-0 flex items-end bg-overlay p-3 transition-opacity duration-200 md:p-4',
			open ? 'opacity-100 ease-out' : 'pointer-events-none opacity-0 ease-in'
		)}
		inert={!open}
	>
		<div
			id="motion-note"
			role="region"
			aria-label="Delivery note for {noted.id}"
			class="flex w-full flex-col gap-3 rounded-md border bg-popover p-4 text-popover-foreground sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="text-sm leading-normal">
				{noted.note}
			</p>
			<Button bind:ref={close} size="sm" variant="ghost" class="self-start sm:self-auto" onclick={hide}>
				Close note
			</Button>
		</div>
	</div>
</div>
