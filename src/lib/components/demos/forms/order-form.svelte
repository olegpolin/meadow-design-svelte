<script lang="ts">
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import {
		NEXT_ORDER_ID,
		customers,
		delivery,
		deliveryFee,
		formatDate,
		formatMoney,
		plantList,
		stockState
	} from '#lib/demos/world.js';

	/**
	 * A counter order for Hollin Nursery, built from Field.FieldGroup and
	 * Field.Field. Validation runs on submit, then live as the fields change.
	 * Plants, prices, runs, slots and the delivery fee all come from the world
	 * module.
	 */

	const plantItems = plantList.map((p) => ({
		value: p.id,
		label: p.name,
		plant: p,
		state: stockState(p),
		// Pre-orders and sold-out plants can't go on a counter order.
		disabled: p.stock === 0
	}));

	const COLLECT = 'collect';
	const fulfilmentItems = [
		...delivery.nextRuns.flatMap((date) =>
			delivery.slots.map((slot) => ({
				value: `${date}-${slot.id}`,
				label: `${formatDate(date)}, ${slot.label.toLowerCase()}`,
				window: slot.window
			}))
		),
		{ value: COLLECT, label: 'Collect from the yard gate', window: 'Any open day, free' }
	];

	const runDays = new Intl.ListFormat('en-US').format(delivery.days);
	const NOTES_MAX = 200;
	const MAX_QTY = 48;

	let customer = $state<string>(customers.marguerite.name);
	let email = $state('');
	let plant = $state('');
	let quantity = $state<number | null>(3);
	let fulfilment = $state(fulfilmentItems[0].value);
	let notes = $state('');
	let submitted = $state(false);
	let placed = $state<string | null>(null);

	const chosen = $derived(plantItems.find((p) => p.value === plant));
	const available = $derived(chosen ? chosen.plant.stock - chosen.plant.reserved : MAX_QTY);
	const subtotal = $derived(chosen && quantity ? chosen.plant.price * quantity : 0);
	const fee = $derived(fulfilment === COLLECT || !subtotal ? 0 : deliveryFee(subtotal));
	const total = $derived(Math.round((subtotal + fee) * 100) / 100);
	const fulfilmentLabel = $derived(
		fulfilmentItems.find((f) => f.value === fulfilment)?.label ?? ''
	);

	const errors = $derived({
		customer: customer.trim() ? '' : 'Add the customer’s name.',
		email: /^\S+@\S+\.\S+$/.test(email) ? '' : 'Enter an email so we can send the receipt.',
		plant: plant ? '' : 'Choose a plant.',
		quantity: !(quantity && Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QTY)
			? `Order between 1 and ${MAX_QTY}. Nell handles larger trade orders.`
			: quantity > available
				? `Only ${available} free to sell. The rest are reserved.`
				: '',
		fulfilment: fulfilment ? '' : 'Choose a run or collection.'
	});

	function shown(key: keyof typeof errors) {
		return submitted ? errors[key] : '';
	}

	function issue(key: keyof typeof errors) {
		const message = shown(key);
		return message ? [{ message }] : undefined;
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
		placed = null;
		if (Object.values(errors).some(Boolean)) return;
		const how =
			fulfilment === COLLECT ? 'to collect from the yard gate' : `for delivery on ${fulfilmentLabel}`;
		placed = `Order ${NEXT_ORDER_ID} placed for ${customer.trim()}: ${quantity} × ${chosen?.label}, ${how}, ${formatMoney(total)}. Receipt sent to ${email}.`;
	}

	function reset() {
		customer = '';
		email = '';
		plant = '';
		quantity = 1;
		fulfilment = '';
		notes = '';
		submitted = false;
		placed = null;
	}
</script>

<form {onsubmit} novalidate class="max-w-2xl">
	<Field.FieldGroup>
		<Field.FieldGroup class="grid sm:grid-cols-2">
			<Field.Field data-invalid={!!shown('customer')}>
				<Field.FieldLabel for="order-customer">Customer</Field.FieldLabel>
				<Input
					id="order-customer"
					autocomplete="name"
					bind:value={customer}
					aria-invalid={shown('customer') ? true : undefined}
				/>
				<Field.FieldError errors={issue('customer')} />
			</Field.Field>
			<Field.Field data-invalid={!!shown('email')}>
				<Field.FieldLabel for="order-email">Email</Field.FieldLabel>
				<Input
					id="order-email"
					type="email"
					autocomplete="email"
					placeholder="For the receipt"
					bind:value={email}
					aria-invalid={shown('email') ? true : undefined}
				/>
				<Field.FieldError errors={issue('email')} />
			</Field.Field>
		</Field.FieldGroup>

		<Field.FieldGroup class="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
			<Field.Field data-invalid={!!shown('plant')}>
				<Field.FieldLabel for="order-plant">Plant</Field.FieldLabel>
				<Select.Root type="single" name="plant" items={plantItems} bind:value={plant}>
					<Select.Trigger
						id="order-plant"
						class="w-full"
						aria-invalid={shown('plant') ? true : undefined}
					>
						<Select.Value placeholder="Choose from stock" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each plantItems as p (p.value)}
								<Select.Item value={p.value} label={p.label} disabled={p.disabled}>
									<span class="truncate">{p.label}</span>
									<span class="ml-auto pl-4 text-muted-foreground tabular-nums">
										{p.disabled ? p.state : formatMoney(p.plant.price)}
									</span>
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<Field.FieldError errors={issue('plant')} />
			</Field.Field>
			<Field.Field data-invalid={!!shown('quantity')}>
				<Field.FieldLabel for="order-quantity">Quantity</Field.FieldLabel>
				<Input
					id="order-quantity"
					type="number"
					min={1}
					max={Math.min(MAX_QTY, available)}
					inputmode="numeric"
					class="tabular-nums"
					bind:value={quantity}
					aria-invalid={shown('quantity') ? true : undefined}
				/>
				<Field.FieldError errors={issue('quantity')} />
			</Field.Field>
		</Field.FieldGroup>

		<Field.Field data-invalid={!!shown('fulfilment')}>
			<Field.FieldLabel for="order-fulfilment">Delivery or collection</Field.FieldLabel>
			<Select.Root type="single" name="fulfilment" items={fulfilmentItems} bind:value={fulfilment}>
				<Select.Trigger
					id="order-fulfilment"
					class="w-full"
					aria-invalid={shown('fulfilment') ? true : undefined}
				>
					<Select.Value placeholder="Choose a run" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each fulfilmentItems as f (f.value)}
							<Select.Item value={f.value} label={f.label}>
								<span class="truncate">{f.label}</span>
								<span class="ml-auto pl-4 text-muted-foreground tabular-nums">{f.window}</span>
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Field.FieldDescription>
				Vans go out on {runDays}, within {delivery.radiusMiles} miles.
				Delivery is {formatMoney(delivery.fee)} on orders under ${delivery.freeOver} and free
				over.
			</Field.FieldDescription>
			<Field.FieldError errors={issue('fulfilment')} />
		</Field.Field>

		<Field.Field>
			<Field.FieldLabel for="order-notes">Notes for the driver</Field.FieldLabel>
			<Textarea
				id="order-notes"
				maxlength={NOTES_MAX}
				placeholder="Gate codes, where to leave the pots"
				bind:value={notes}
			/>
			<Field.FieldDescription class="tabular-nums">
				{notes.length} of {NOTES_MAX} characters
			</Field.FieldDescription>
		</Field.Field>

		{#if subtotal}
			<p class="text-sm tabular-nums">
				{formatMoney(subtotal)} for the plants{fulfilment === COLLECT
					? ', collected free.'
					: fee
						? `, plus ${formatMoney(fee)} delivery.`
						: ', delivered free.'}
			</p>
		{/if}

		<Field.Field orientation="horizontal" class="flex-wrap">
			<Button type="submit">Place order{total ? ` for ${formatMoney(total)}` : ''}</Button>
			<Button type="button" variant="ghost" onclick={reset}>Clear form</Button>
		</Field.Field>

		{#if placed}
			<p role="status" class="text-sm leading-normal">{placed}</p>
		{/if}
	</Field.FieldGroup>
</form>
