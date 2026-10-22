<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { delivery, formatMoney, shop as hollin, shortcuts, staff, weather } from '#lib/demos/world.js';

	type ShopSettings = {
		name: string;
		email: string;
		phone: string;
		street: string;
		town: string;
		state: string;
		zip: string;
		hours: string;
		/** Percent, e.g. 6.25. */
		taxRate: number;
		fee: number;
		freeOver: number;
		radius: string;
		days: string[];
		slots: string[];
	};

	/* What was last saved, so "Undo changes" has somewhere to go back to. Starts from the world module. */
	let saved: ShopSettings = {
		name: hollin.name,
		email: hollin.email,
		phone: hollin.phone,
		street: hollin.address.street,
		town: hollin.address.town,
		state: hollin.address.state,
		zip: hollin.address.zip,
		hours: hollin.hours,
		taxRate: Math.round(hollin.taxRate * 10000) / 100,
		fee: delivery.fee,
		freeOver: delivery.freeOver,
		radius: String(delivery.radiusMiles),
		days: [...delivery.days],
		slots: delivery.slots.map((s) => s.id)
	};

	let form = $state<ShopSettings>(structuredClone(saved));
	let tried = $state(false);
	let frostAlerts = $state(true);
	let stockEmails = $state(true);
	let formEl = $state<HTMLFormElement | null>(null);

	/* Ctrl S saves, as everywhere in the shop admin. */
	function onkeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 's' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			formEl?.requestSubmit();
		}
	}

	/* The shop is closed on Mondays, so the vans can only go out the other six days. */
	const weekdays = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	const radii = [8, 12, 16].map((m) => ({ value: String(m), label: `${m} miles from the shop` }));

	const errors = $derived({
		name: tried && !form.name.trim() ? 'The shop needs a name for receipts.' : '',
		email: tried && !/^\S+@\S+\.\S+$/.test(form.email) ? `Use an address like ${hollin.email}.` : '',
		zip: tried && !/^\d{5}$/.test(form.zip) ? 'Use a 5-digit ZIP code.' : '',
		taxRate: tried && !(form.taxRate >= 0 && form.taxRate < 20) ? 'Use a rate between 0 and 20 percent.' : '',
		days: tried && form.days.length === 0 ? 'Pick at least one van day, or customers can only collect.' : '',
		slots: tried && form.slots.length === 0 ? 'Keep at least one slot open on van days.' : ''
	});

	function toggle(list: 'days' | 'slots', id: string, on: boolean) {
		form[list] = on ? [...form[list], id] : form[list].filter((d) => d !== id);
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		tried = true;
		if (Object.values(errors).some(Boolean)) {
			toast.error('Settings not saved', { description: 'Fix the fields marked in red, then save again.' });
			return;
		}
		tried = false;
		saved = $state.snapshot(form);
		toast.success('Settings saved', { description: 'Receipts and the website use them from the next order.' });
	}
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<title>Settings · Hollin Nursery</title>
</svelte:head>

<div class="flex max-w-2xl flex-col gap-10">
	<div class="flex flex-col gap-1">
		<h1 class="display-3">Settings</h1>
		<p class="text-[0.9375rem] text-muted-foreground">What customers see on receipts, and when the vans go out.</p>
	</div>

	<form bind:this={formEl} onsubmit={save} novalidate class="flex flex-col gap-10">
		<Field.Set>
			<Field.Legend>Shop details</Field.Legend>
			<Field.Group>
				<Field.Field data-invalid={errors.name ? true : undefined}>
					<Field.Label for="set-name">Shop name</Field.Label>
					<Input id="set-name" bind:value={form.name} aria-invalid={errors.name ? true : undefined} />
					{#if errors.name}<Field.Error>{errors.name}</Field.Error>{/if}
				</Field.Field>
				<div class="grid gap-5 sm:grid-cols-2">
					<Field.Field data-invalid={errors.email ? true : undefined}>
						<Field.Label for="set-email">Email for orders</Field.Label>
						<Input id="set-email" type="email" bind:value={form.email} aria-invalid={errors.email ? true : undefined} />
						{#if errors.email}<Field.Error>{errors.email}</Field.Error>{/if}
					</Field.Field>
					<Field.Field>
						<Field.Label for="set-phone">Phone</Field.Label>
						<Input id="set-phone" type="tel" bind:value={form.phone} />
					</Field.Field>
				</div>
				<Field.Field>
					<Field.Label for="set-street">Street address</Field.Label>
					<Input id="set-street" autocomplete="street-address" bind:value={form.street} />
				</Field.Field>
				<div class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_5rem_7rem]">
					<Field.Field>
						<Field.Label for="set-town">Town</Field.Label>
						<Input id="set-town" bind:value={form.town} />
					</Field.Field>
					<Field.Field>
						<Field.Label for="set-state">State</Field.Label>
						<Input id="set-state" maxlength={2} bind:value={form.state} />
					</Field.Field>
					<Field.Field data-invalid={errors.zip ? true : undefined}>
						<Field.Label for="set-zip">ZIP code</Field.Label>
						<Input id="set-zip" inputmode="numeric" maxlength={5} bind:value={form.zip} aria-invalid={errors.zip ? true : undefined} />
						{#if errors.zip}<Field.Error>{errors.zip}</Field.Error>{/if}
					</Field.Field>
				</div>
				<div class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_9rem]">
					<Field.Field>
						<Field.Label for="set-hours">Opening hours</Field.Label>
						<Input id="set-hours" bind:value={form.hours} />
						<Field.Description>Closed {hollin.closedDays.join(' and ')}s.</Field.Description>
					</Field.Field>
					<Field.Field data-invalid={errors.taxRate ? true : undefined}>
						<Field.Label for="set-tax">Sales tax (%)</Field.Label>
						<Input
							id="set-tax"
							type="number"
							min="0"
							step="0.01"
							inputmode="decimal"
							bind:value={form.taxRate}
							aria-invalid={errors.taxRate ? true : undefined}
						/>
						{#if errors.taxRate}<Field.Error>{errors.taxRate}</Field.Error>{/if}
					</Field.Field>
				</div>
			</Field.Group>
		</Field.Set>

		<Field.Set>
			<Field.Legend>Van delivery</Field.Legend>
			<Field.Group>
				<div class="grid gap-5 sm:grid-cols-2">
					<Field.Field>
						<Field.Label for="set-fee">Delivery fee ($)</Field.Label>
						<Input id="set-fee" type="number" min="0" step="0.5" inputmode="decimal" bind:value={form.fee} />
						<Field.Description>Charged on orders under the free delivery amount.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="set-free">Free delivery over ($)</Field.Label>
						<Input id="set-free" type="number" min="0" step="5" inputmode="decimal" bind:value={form.freeOver} />
						<Field.Description>
							{form.freeOver > 0 ? `Orders of ${formatMoney(form.freeOver)} or more go free.` : 'Every order goes free.'}
						</Field.Description>
					</Field.Field>
				</div>
				<Field.Field>
					<Field.Label for="set-radius">Delivery radius</Field.Label>
					<Select.Root type="single" items={radii} bind:value={form.radius}>
						<Select.Trigger id="set-radius" class="w-full sm:w-72">
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each radii as r (r.value)}
									<Select.Item value={r.value} label={r.label} />
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Field.Field>
				<Field.Set data-invalid={errors.days ? true : undefined}>
					<Field.Legend variant="label">Van days</Field.Legend>
					<div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
						{#each weekdays as day (day)}
							<Field.Field orientation="horizontal">
								<Checkbox
									id="day-{day}"
									checked={form.days.includes(day)}
									onCheckedChange={(v) => toggle('days', day, v)}
								/>
								<Field.Label for="day-{day}" class="font-normal">{day}</Field.Label>
							</Field.Field>
						{/each}
					</div>
					{#if errors.days}<Field.Error>{errors.days}</Field.Error>{/if}
				</Field.Set>
				<Field.Set data-invalid={errors.slots ? true : undefined}>
					<Field.Legend variant="label">Slots</Field.Legend>
					<div class="flex flex-col gap-3">
						{#each delivery.slots as slot (slot.id)}
							<Field.Field orientation="horizontal">
								<Checkbox
									id="slot-{slot.id}"
									checked={form.slots.includes(slot.id)}
									onCheckedChange={(v) => toggle('slots', slot.id, v)}
								/>
								<Field.Label for="slot-{slot.id}" class="font-normal">{slot.label}, {slot.window}</Field.Label>
							</Field.Field>
						{/each}
					</div>
					{#if errors.slots}<Field.Error>{errors.slots}</Field.Error>{/if}
				</Field.Set>
			</Field.Group>
		</Field.Set>

		<Field.Set>
			<Field.Legend>Alerts</Field.Legend>
			<Field.Group>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="set-frost">Frost warnings on Today</Field.Label>
						<Field.Description>
							From {weather.source}, when it drops below 32°F overnight.
						</Field.Description>
					</Field.Content>
					<Switch id="set-frost" bind:checked={frostAlerts} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="set-stock">Low stock email to {staff.tomasz.name.split(' ')[0]}</Field.Label>
						<Field.Description>Every Tuesday at 7:00 AM, with a reorder list he can forward.</Field.Description>
					</Field.Content>
					<Switch id="set-stock" bind:checked={stockEmails} />
				</Field.Field>
			</Field.Group>
		</Field.Set>

		<div class="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
			<Button
				type="button"
				variant="outline"
				onclick={() => {
					form = structuredClone(saved);
					tried = false;
				}}
			>
				Undo changes
			</Button>
			<Button type="submit">
				Save settings
				<Kbd.Group class="max-sm:hidden" aria-hidden="true">
					{#each shortcuts.save.keys as key (key)}<Kbd.Root>{key}</Kbd.Root>{/each}
				</Kbd.Group>
			</Button>
		</div>
	</form>
</div>
