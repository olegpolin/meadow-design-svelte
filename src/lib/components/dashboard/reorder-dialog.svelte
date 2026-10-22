<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import { TODAY, formatDate } from '#lib/demos/world.js';
	import { addDays, defaultReorder, supplierName, suppliers, type ShopPlant } from './data.js';
	import { getShop } from './shop.svelte.js';

	let { plant }: { plant: ShopPlant } = $props();

	const shop = getShop();
	const supplierItems = suppliers.map((s) => ({ value: s.id, label: s.name }));

	let open = $state(false);
	let supplier = $state('');
	let qty = $state<number | null>(null);
	let note = $state('');
	let tried = $state(false);

	const qtyInvalid = $derived(tried && (!qty || qty < 1));
	const supplierInvalid = $derived(tried && !supplier);
	const chosen = $derived(suppliers.find((s) => s.id === supplier));

	function reset(isOpen: boolean) {
		if (!isOpen) return;
		supplier = plant.supplier && plant.supplier !== 'grown' ? plant.supplier : '';
		qty = defaultReorder(plant);
		note = '';
		tried = false;
	}

	function send(event: SubmitEvent) {
		event.preventDefault();
		tried = true;
		if (!qty || qty < 1 || !supplier) return;
		shop.reorder(plant.id, qty, supplier);
		open = false;
		toast.success(`Reorder sent to ${supplierName(supplier)}`, {
			description: `${qty} × ${plant.name}, ${plant.form}.`
		});
	}

	const formId = $derived(`reorder-${plant.id}`);
</script>

<Dialog.Root bind:open onOpenChange={reset}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'xs' })}>
		Reorder<span class="sr-only">&nbsp;{plant.name}</span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Reorder {plant.name}</Dialog.Title>
			<Dialog.Description>
				{plant.stock === 0 ? 'None left' : `${plant.stock} left`} in {plant.location}, {plant.reserved} reserved
				for orders.
			</Dialog.Description>
		</Dialog.Header>
		<form id={formId} onsubmit={send} novalidate>
			<Field.Group>
				<Field.Field data-invalid={supplierInvalid || undefined}>
					<Field.Label for="{formId}-supplier">Supplier</Field.Label>
					<Select.Root type="single" items={supplierItems} bind:value={supplier}>
						<Select.Trigger id="{formId}-supplier" class="w-full" aria-invalid={supplierInvalid || undefined}>
							<Select.Value placeholder="Choose a supplier" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each supplierItems as s (s.value)}
									<Select.Item value={s.value} label={s.label} />
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					{#if supplierInvalid}
						<Field.Error>Pick who this order goes to.</Field.Error>
					{/if}
				</Field.Field>
				<Field.Field data-invalid={qtyInvalid || undefined}>
					<Field.Label for="{formId}-qty">Quantity</Field.Label>
					<Input
						id="{formId}-qty"
						type="number"
						inputmode="numeric"
						min="1"
						bind:value={qty}
						aria-invalid={qtyInvalid || undefined}
					/>
					{#if qtyInvalid}
						<Field.Error>Order at least one.</Field.Error>
					{:else}
						<Field.Description>
							{chosen ? `${chosen.delivers} Usually here by ${formatDate(addDays(TODAY, chosen.leadDays))}.` : 'Pick a supplier to see when it lands.'}
						</Field.Description>
					{/if}
				</Field.Field>
				<Field.Field>
					<Field.Label for="{formId}-note">Note for the supplier</Field.Label>
					<Textarea id="{formId}-note" bind:value={note} placeholder="Optional. Pot size, delivery slot, a substitute you would take." />
				</Field.Field>
			</Field.Group>
		</form>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<Button type="submit" form={formId}>Send reorder</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
