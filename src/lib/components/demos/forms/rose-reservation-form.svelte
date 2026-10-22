<script lang="ts">
	import { fromAction } from 'svelte/attachments';
	import { z } from 'zod';
	import { superForm, defaults, setMessage } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { NativeSelect, NativeSelectOption } from '#lib/components/ui/native-select/index.js';
	import {
		delivery,
		deliveryFee,
		formatLongDate,
		formatMoney,
		order,
		plants,
		shop
	} from '#lib/demos/world.js';

	/**
	 * Superforms in SPA mode with a zod schema, rendered with formsnap through
	 * the Form components. Nothing is posted; the message stands in for the
	 * server's reply. The rose, its price and arrival date, and the first run
	 * after it lands (as on order #4471) come from the world module.
	 */

	const rose = plants.rose;
	const arrives = formatLongDate(rose.arrives);
	// The first van run after the roses land, as booked for order #4471.
	const firstRun = order('#4471').due!;
	const MAX = 48;

	const options = [
		{ value: 'collect', label: `Collect from the yard gate, from ${arrives}` },
		{ value: 'deliver', label: `Deliver on ${formatLongDate(firstRun)}` }
	];

	const schema = z.object({
		name: z.string().min(2, 'Add the name we should write on the label.'),
		email: z.email('Enter an email so we can tell you when the roses arrive.'),
		fulfilment: z.string().min(1, 'Choose collection or delivery.'),
		count: z
			.number('Enter a number.')
			.int('Whole roses only.')
			.min(1, 'Reserve at least one.')
			.max(MAX, `For more than ${MAX}, call the shop on ${shop.phone}.`)
	});

	const form = superForm(defaults({ name: '', email: '', fulfilment: '', count: 3 }, zod4(schema)), {
		SPA: true,
		validators: zod4Client(schema),
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				const { name, email, count, fulfilment } = form.data;
				const subtotal = count * rose.price;
				const when =
					fulfilment === 'deliver'
						? `Priya delivers them on ${formatLongDate(firstRun)}`
						: `They are ready at the yard gate from ${arrives}`;
				setMessage(
					form,
					`Reserved ${count} × ${rose.name} for ${name}, ${formatMoney(subtotal)}. ${when}. We will email ${email} when they land.`
				);
			}
		}
	});

	const { form: formData, enhance, message } = form;

	const subtotal = $derived(($formData.count > 0 ? $formData.count : 0) * rose.price);
	const fee = $derived($formData.fulfilment === 'deliver' && subtotal ? deliveryFee(subtotal) : 0);
</script>

<form method="POST" {@attach fromAction(enhance)} class="flex max-w-xl flex-col gap-5">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name on the label</Form.Label>
				<Input {...props} autocomplete="name" bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} type="email" autocomplete="email" bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.Description>One email when the roses arrive, nothing else.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
		<Form.Field {form} name="fulfilment">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Collection or delivery</Form.Label>
					<NativeSelect {...props} class="w-full" bind:value={$formData.fulfilment}>
						<NativeSelectOption value="" disabled>Choose one</NativeSelectOption>
						{#each options as o (o.value)}
							<NativeSelectOption value={o.value}>{o.label}</NativeSelectOption>
						{/each}
					</NativeSelect>
				{/snippet}
			</Form.Control>
			<Form.Description>
				Delivery is {formatMoney(delivery.fee)} under ${delivery.freeOver}, free over.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="count">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>How many</Form.Label>
					<Input
						{...props}
						type="number"
						inputmode="numeric"
						class="tabular-nums"
						bind:value={$formData.count}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<Form.Button>Reserve roses</Form.Button>
		<span class="text-sm text-muted-foreground tabular-nums">
			{rose.name}, {formatMoney(rose.price)} each.
			{#if subtotal}
				{formatMoney(subtotal + fee)}{fee ? ` with ${formatMoney(fee)} delivery` : ''}, paid when they arrive.
			{/if}
		</span>
	</div>

	{#if $message}
		<p role="status" class="text-sm leading-normal">{$message}</p>
	{/if}
</form>
