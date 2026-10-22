<script lang="ts">
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { CatalogPage, Section, Demo } from '#lib/components/showcase/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import {
		NativeSelect,
		NativeSelectOption,
		NativeSelectOptGroup
	} from '#lib/components/ui/native-select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import OrderForm from '#lib/components/demos/forms/order-form.svelte';
	import RoseReservationForm from '#lib/components/demos/forms/rose-reservation-form.svelte';
	import PickersSections from '#lib/components/demos/forms/pickers-sections.svelte';
	import {
		customers,
		delivery,
		deliveryFee,
		formatDate,
		formatLongDate,
		formatMoney,
		order,
		orderItems,
		orderSubtotal,
		orders,
		plantList,
		plants,
		staff,
		staffList,
		stockState,
		type OrderStatus
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'input', title: 'Input' },
		{ id: 'textarea', title: 'Textarea' },
		{ id: 'label', title: 'Label' },
		{ id: 'field', title: 'Field' },
		{ id: 'form', title: 'Form' },
		{ id: 'input-group', title: 'Input group' },
		{ id: 'input-otp', title: 'Input OTP' },
		{ id: 'native-select', title: 'Native select' },
		{ id: 'select', title: 'Select' },
		{ id: 'combobox', title: 'Combobox' },
		{ id: 'command', title: 'Command' },
		{ id: 'calendar', title: 'Calendar' },
		{ id: 'range-calendar', title: 'Range calendar' },
		{ id: 'date-picker', title: 'Date picker' },
		{ id: 'checkbox', title: 'Checkbox' },
		{ id: 'radio-group', title: 'Radio group' },
		{ id: 'switch', title: 'Switch' },
		{ id: 'slider', title: 'Slider' }
	];

	const listFormat = new Intl.ListFormat('en-US');
	const runDays = listFormat.format(delivery.days);
	const priceLabel = (plant: (typeof plantList)[number]) => {
		const state = stockState(plant);
		return state === 'Sold out' || state === 'Pre-order' ? state : formatMoney(plant.price);
	};

	// Input
	let stockListEmail = $state('');
	let stockListJoined = $state(false);

	// Textarea
	let driverNote = $state(
		'Side gate is unlocked. Leave the witch hazel by the greenhouse, not on the drive.'
	);
	const growerNote = `Hellebores from batch 26-114, potted on ${formatLongDate('2026-09-29')}. Roots soaked overnight before potting.`;

	// Input group
	let search = $state('rose');
	const matches = $derived(
		plantList.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
	);
	let code = $state('SUMMER26');
	let appliedCode = $state<'none' | 'valid' | 'invalid'>('invalid');
	function applyCode() {
		appliedCode = code.trim().toUpperCase() === 'BAREROOT26' ? 'valid' : 'invalid';
	}
	let messageToPriya = $state('');
	let messageSent = $state<string | null>(null);

	// Input OTP
	let otp = $state('');
	let otpState = $state<'idle' | 'checking' | 'done'>('idle');
	function checkCode() {
		otpState = 'checking';
		setTimeout(() => (otpState = 'done'), 900);
	}
	function resetCode() {
		otp = '';
		otpState = 'idle';
	}

	// Native select
	// The Saturday afternoon run is already full.
	const fullSlot = `${delivery.nextRuns[0]}-pm`;
	let slot = $state(`${delivery.nextRuns[0]}-am`);

	// Select
	const toItem = (p: (typeof plantList)[number]) => ({ value: p.id, label: p.name, plant: p });
	const stock = [
		{ heading: 'Perennials', items: plantList.filter((p) => p.category === 'Perennials').map(toItem) },
		{
			heading: 'Shrubs and trees',
			items: plantList.filter((p) => p.category === 'Shrubs' || p.category === 'Trees').map(toItem)
		}
	];
	const allStock = stock.flatMap((g) => g.items);
	let pickedPlant = $state<string>(plants.seaHolly.id);
	const staffItems = staffList.map((p) => ({ value: p.id, label: p.name }));
	let assignee = $state<string>(order('#4479').van === 'Van 2' ? staff.tomasz.id : staff.priya.id);
	const countBy = (status: OrderStatus) => orders.filter((o) => o.status === status).length;
	const views = [
		{ value: 'open', label: `Open orders (${countBy('Open')})` },
		{ value: 'delivered', label: `Delivered (${countBy('Delivered')})` },
		{ value: 'all', label: `All orders (${orders.length})` }
	];
	let view = $state('open');
	let traySize = $state('');

	// Checkbox
	// The allotment society's order, packed for Saturday's run.
	const pickOrder = order('#4476');
	let pickList = $state(
		pickOrder.lines.map((line, i) => ({
			id: line.plant.id,
			label: line.plant.name,
			qty: line.qty,
			picked: i === 0
		}))
	);
	const pickedCount = $derived(pickList.filter((i) => i.picked).length);
	let termsAccepted = $state(false);
	let termsTried = $state(true);

	// Field choice cards: Rosa's order #4481, booked to collect.
	const rosaOrder = order('#4481');
	const rosaSubtotal = orderSubtotal(rosaOrder);
	const rosaFee = deliveryFee(rosaSubtotal);
	let rosaMethod = $state<string>(rosaOrder.fulfilment === 'collection' ? 'collect' : 'van');

	// Radio group: Marguerite's order #4479.
	const radioOrder = order('#4479');
	const radioSlot = delivery.slots.find((s) => s.id === radioOrder.slot)!;
	const radioFee = deliveryFee(orderSubtotal(radioOrder));
	let deliveryMethod = $state('van');
	let potSize = $state('2l');

	// Switch
	let notifyOrders = $state(true);
	let notifyStock = $state(true);
	let notifyRoute = $state(false);
	let pricesWithTax = $state(true);
	let showOutOfStock = $state(false);

	// Slider
	// Trade price for bare-root roses, from 24 roses.
	const ROSE_TRADE_FROM = 24;
	const ROSE_TRADE_PRICE = 19.5;
	let roses = $state(14);
	const roseUnit = $derived(roses >= ROSE_TRADE_FROM ? ROSE_TRADE_PRICE : plants.rose.price);
	const prices = plantList.map((p) => p.price);
	const priceMin = Math.floor(Math.min(...prices));
	const priceMax = Math.ceil(Math.max(...prices));
	let priceRange = $state([8, 25]);
	const inRange = $derived(
		plantList.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
	);
</script>

<CatalogPage group="forms" {sections}>
	<!-- Input ------------------------------------------------------------ -->
	<Section
		id="input"
		title="Input"
		description="A single line of text: a name, an email, a number. Pair it with a label in a field."
	>
		<Demo label="Filled, empty, invalid and disabled" layout="block">
			<Field.FieldGroup class="grid sm:grid-cols-2">
				<Field.Field>
					<Field.FieldLabel for="input-customer">Customer</Field.FieldLabel>
					<Input id="input-customer" value={customers.hal.name} autocomplete="off" />
				</Field.Field>
				<Field.Field>
					<Field.FieldLabel for="input-email">Email</Field.FieldLabel>
					<Input id="input-email" type="email" placeholder="For the receipt" autocomplete="off" />
				</Field.Field>
				<Field.Field data-invalid>
					<Field.FieldLabel for="input-phone">Phone</Field.FieldLabel>
					<Input id="input-phone" type="tel" value={customers.hal.phone.slice(0, 12)} aria-invalid autocomplete="off" />
					<Field.FieldError>Phone numbers need 10 digits.</Field.FieldError>
				</Field.Field>
				<Field.Field data-disabled>
					<Field.FieldLabel for="input-account">Trade account</Field.FieldLabel>
					<Input id="input-account" value="HN-0388" disabled />
					<Field.FieldDescription>Set by {staff.june.name.split(' ')[0]} in accounts.</Field.FieldDescription>
				</Field.Field>
			</Field.FieldGroup>
		</Demo>

		<Demo label="File" layout="block">
			<Field.Field class="max-w-md">
				<Field.FieldLabel for="input-plan">Planting plan</Field.FieldLabel>
				<Input id="input-plan" type="file" accept=".pdf,.jpg,.png" />
				<Field.FieldDescription>PDF or photo, up to 8 MB. Tomasz reads these before quoting.</Field.FieldDescription>
			</Field.Field>
		</Demo>

		<Demo label="On the ink card" tone="ink" layout="block">
			{#if stockListJoined}
				<p role="status" class="text-[0.9375rem]">
					Done. The Friday stock list goes to {stockListEmail} from next week.
				</p>
			{:else}
				<form
					class="flex max-w-lg flex-col gap-3"
					onsubmit={(e) => {
						e.preventDefault();
						if (stockListEmail.includes('@')) stockListJoined = true;
					}}
				>
					<Label for="stock-list-email">Get the Friday stock list</Label>
					<div class="flex flex-col gap-3 sm:flex-row">
						<Input
							id="stock-list-email"
							type="email"
							required
							placeholder={customers.rosa.email}
							bind:value={stockListEmail}
						/>
						<Button type="submit" variant="secondary">Send it to me</Button>
					</div>
				</form>
			{/if}
		</Demo>
	</Section>

	<!-- Textarea --------------------------------------------------------- -->
	<Section
		id="textarea"
		title="Textarea"
		description="Several lines of free text, like delivery notes or a reason for a return. It grows with its content."
	>
		<Demo label="Notes for the driver" tone="warm" layout="block">
			<Field.Field class="max-w-xl">
				<Field.FieldLabel for="textarea-driver">Notes for Priya</Field.FieldLabel>
				<Textarea id="textarea-driver" maxlength={200} bind:value={driverNote} />
				<Field.FieldDescription class="tabular-nums">
					{driverNote.length} of 200 characters
				</Field.FieldDescription>
			</Field.Field>
		</Demo>

		<Demo label="Invalid and disabled" layout="block">
			<Field.FieldGroup class="grid md:grid-cols-2">
				<Field.Field data-invalid>
					<Field.FieldLabel for="textarea-return">Reason for the return</Field.FieldLabel>
					<Textarea id="textarea-return" aria-invalid placeholder="What went wrong with the plant?" />
					<Field.FieldError>Tell us what went wrong so Tomasz can check the batch.</Field.FieldError>
				</Field.Field>
				<Field.Field data-disabled>
					<Field.FieldLabel for="textarea-grower">Grower’s note</Field.FieldLabel>
					<Textarea
						id="textarea-grower"
						disabled
						value={growerNote}
					/>
					<Field.FieldDescription>Only Tomasz can edit this.</Field.FieldDescription>
				</Field.Field>
			</Field.FieldGroup>
		</Demo>
	</Section>

	<!-- Label ------------------------------------------------------------ -->
	<Section
		id="label"
		title="Label"
		description="Names a control and makes its text clickable. Inside forms, use the field label instead."
	>
		<Demo label="Next to a control" layout="stack">
			<div class="flex items-center gap-3">
				<Checkbox id="label-back-door" checked />
				<Label for="label-back-door">Leave it by the back door</Label>
			</div>
			<div class="flex items-center gap-3">
				<Checkbox id="label-call" disabled />
				<Label for="label-call">Call before delivery (Priya is driving)</Label>
			</div>
			<div class="flex max-w-sm flex-col gap-2.5">
				<Label for="label-gift">Gift message</Label>
				<Input id="label-gift" placeholder="Happy birthday, Dev" />
			</div>
		</Demo>
	</Section>

	<!-- Field ------------------------------------------------------------ -->
	<Section
		id="field"
		title="Field"
		description="Lays out a label, a control, help text and an error. Group fields with a field group and related choices with a field set."
	>
		<Demo label="A counter order" layout="block">
			<OrderForm />
		</Demo>

		<Demo label="Choice cards" tone="cool" layout="block">
			<Field.FieldSet class="max-w-xl">
				<Field.FieldLegend>How should Rosa’s order reach her?</Field.FieldLegend>
				<Field.FieldDescription>
					Order {rosaOrder.id}, {orderItems(rosaOrder)} items, {formatMoney(rosaSubtotal)}.
				</Field.FieldDescription>
				<RadioGroup.Root bind:value={rosaMethod}>
					<Field.FieldLabel for="choice-van">
						<Field.Field orientation="horizontal">
							<Field.FieldContent>
								<Field.FieldTitle>Van 1 with Priya, {formatLongDate(delivery.nextRuns[0])}</Field.FieldTitle>
								<Field.FieldDescription>
									Morning run, {delivery.slots[0].window}. {rosaFee ? formatMoney(rosaFee) : `Free over $${delivery.freeOver}`}
								</Field.FieldDescription>
							</Field.FieldContent>
							<RadioGroup.Item value="van" id="choice-van" />
						</Field.Field>
					</Field.FieldLabel>
					<Field.FieldLabel for="choice-collect">
						<Field.Field orientation="horizontal">
							<Field.FieldContent>
								<Field.FieldTitle>Collect from the yard gate, {formatLongDate(rosaOrder.due!)}</Field.FieldTitle>
								<Field.FieldDescription>Any open day, 9:00 AM to 5:00 PM. Free</Field.FieldDescription>
							</Field.FieldContent>
							<RadioGroup.Item value="collect" id="choice-collect" />
						</Field.Field>
					</Field.FieldLabel>
				</RadioGroup.Root>
			</Field.FieldSet>
		</Demo>
	</Section>

	<!-- Form ------------------------------------------------------------- -->
	<Section
		id="form"
		title="Form"
		description="Formsnap and Superforms with a schema: validation, errors and messages wired to the same field styles."
	>
		<Demo label="Reserve bare-root roses" layout="block">
			<RoseReservationForm />
		</Demo>
	</Section>

	<!-- Input group ------------------------------------------------------ -->
	<Section
		id="input-group"
		title="Input group"
		description="An input with text, icons or a button inside the same pill."
	>
		<Demo label="Search, price and discount code" layout="block">
			<Field.FieldGroup class="max-w-xl">
				<Field.Field>
					<Field.FieldLabel for="group-search">Find a plant</Field.FieldLabel>
					<InputGroup.Root>
						<InputGroup.Addon>
							<SearchIcon aria-hidden="true" />
						</InputGroup.Addon>
						<InputGroup.Input id="group-search" placeholder="Name or variety" bind:value={search} />
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text class="tabular-nums">
								{matches.length === 0 ? 'No matches' : matches.length === 1 ? '1 plant' : `${matches.length} plants`}
							</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if search.trim() && matches.length}
						<ul class="divide-y divide-hairline border-y border-hairline text-sm">
							{#each matches.slice(0, 4) as p (p.id)}
								<li class="flex items-baseline justify-between gap-4 py-2">
									<span class="min-w-0 truncate">{p.name}</span>
									<span class="shrink-0 text-muted-foreground tabular-nums">
										{stockState(p) === 'Pre-order' || stockState(p) === 'Sold out'
											? `${stockState(p)}, ${formatMoney(p.price)}`
											: formatMoney(p.price)}
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				</Field.Field>

				<Field.Field>
					<Field.FieldLabel for="group-price">Price, {plants.hellebore.name}</Field.FieldLabel>
					<InputGroup.Root>
						<InputGroup.Addon>
							<InputGroup.Text>$</InputGroup.Text>
						</InputGroup.Addon>
						<InputGroup.Input
							id="group-price"
							value={plants.hellebore.price.toFixed(2)}
							inputmode="decimal"
							class="tabular-nums"
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>per {plants.hellebore.form}</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>

				<Field.Field data-invalid={appliedCode === 'invalid'}>
					<Field.FieldLabel for="group-code">Discount code</Field.FieldLabel>
					<InputGroup.Root>
						<InputGroup.Input
							id="group-code"
							class="uppercase"
							bind:value={code}
							aria-invalid={appliedCode === 'invalid' ? true : undefined}
							oninput={() => (appliedCode = 'none')}
						/>
						{#if appliedCode === 'valid'}
							<InputGroup.Addon align="inline-end">
								<InputGroup.Text>10% off</InputGroup.Text>
							</InputGroup.Addon>
						{/if}
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button size="sm" variant="default" onclick={applyCode}>Apply</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if appliedCode === 'invalid'}
						<Field.FieldError>That code ended on {formatLongDate('2026-09-30')}. Try BAREROOT26.</Field.FieldError>
					{/if}
				</Field.Field>

				<Field.Field data-disabled>
					<Field.FieldLabel for="group-gift">Gift card</Field.FieldLabel>
					<InputGroup.Root>
						<InputGroup.Addon>
							<InputGroup.Text>HN</InputGroup.Text>
						</InputGroup.Addon>
						<InputGroup.Input id="group-gift" disabled placeholder="16 digits" />
					</InputGroup.Root>
					<Field.FieldDescription>Gift cards are paused while {staff.june.name.split(' ')[0]} moves the till.</Field.FieldDescription>
				</Field.Field>
			</Field.FieldGroup>
		</Demo>

		<Demo label="With a textarea" tone="warm" layout="block">
			<Field.Field class="max-w-xl">
				<Field.FieldLabel for="group-message">Message Priya</Field.FieldLabel>
				<InputGroup.Root>
					<InputGroup.Textarea
						id="group-message"
						maxlength={160}
						placeholder="Route changes, a customer who called"
						bind:value={messageToPriya}
					/>
					<InputGroup.Addon align="block-end" class="border-t">
						<InputGroup.Text class="tabular-nums">{messageToPriya.length} of 160</InputGroup.Text>
						<InputGroup.Button
							size="sm"
							variant="default"
							class="ml-auto"
							disabled={!messageToPriya.trim()}
							onclick={() => {
								messageSent = messageToPriya.trim();
								messageToPriya = '';
							}}
						>
							Send text
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
				{#if messageSent}
					<Field.FieldDescription role="status">Sent to Priya at 10:14 AM: “{messageSent}”</Field.FieldDescription>
				{/if}
			</Field.Field>
		</Demo>
	</Section>

	<!-- Input OTP -------------------------------------------------------- -->
	<Section
		id="input-otp"
		title="Input OTP"
		description="A one-time code, one box per character. Paste fills every box at once."
	>
		<Demo label="Sign in to the till" layout="stack">
			<Field.Field class="w-fit">
				<Field.FieldLabel for="otp-signin">Code from your email</Field.FieldLabel>
				<InputOTP.Root
					inputId="otp-signin"
					maxlength={6}
					pattern={REGEXP_ONLY_DIGITS}
					bind:value={otp}
					disabled={otpState !== 'idle'}
					onComplete={checkCode}
				>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3, 6) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.FieldDescription role="status">
					{#if otpState === 'checking'}
						Checking the code.
					{:else if otpState === 'done'}
						Signed in as {staff.nell.name}.
					{:else}
						We sent 6 digits to {staff.nell.email}. They expire at 10:42 AM.
					{/if}
				</Field.FieldDescription>
			</Field.Field>
			{#if otpState === 'done'}
				<div>
					<Button variant="outline" size="sm" onclick={resetCode}>Sign out</Button>
				</div>
			{/if}
		</Demo>

		<Demo label="Wrong code" tone="cool" layout="stack">
			<Field.Field data-invalid class="w-fit">
				<Field.FieldLabel for="otp-wrong">Code from your email</Field.FieldLabel>
				<InputOTP.Root inputId="otp-wrong" maxlength={6} value="483920" readonly>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} aria-invalid />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.FieldError>That code doesn’t match. Use the newest email, sent at 10:32 AM.</Field.FieldError>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Native select ---------------------------------------------------- -->
	<Section
		id="native-select"
		title="Native select"
		description="The browser’s own select, styled as a pill. Best on phones and for long, plain lists."
	>
		<Demo label="Delivery slot" layout="block">
			<Field.Field class="max-w-sm">
				<Field.FieldLabel for="native-slot">Delivery slot</Field.FieldLabel>
				<NativeSelect id="native-slot" class="w-full" bind:value={slot}>
					{#each delivery.nextRuns as run (run)}
						<NativeSelectOptGroup label={formatLongDate(run)}>
							{#each delivery.slots as s (s.id)}
								{@const value = `${run}-${s.id}`}
								<NativeSelectOption {value} disabled={value === fullSlot}>
									{s.label}, {s.window}{value === fullSlot ? ' (full)' : ''}
								</NativeSelectOption>
							{/each}
						</NativeSelectOptGroup>
					{/each}
				</NativeSelect>
				<Field.FieldDescription>Runs go out on {runDays}.</Field.FieldDescription>
			</Field.Field>
		</Demo>

		<Demo label="Small, invalid and disabled" tone="warm" class="items-end">
			<Field.Field class="w-auto">
				<Field.FieldLabel for="native-sort">Sort by</Field.FieldLabel>
				<NativeSelect id="native-sort" size="sm">
					<NativeSelectOption value="newest">Newest first</NativeSelectOption>
					<NativeSelectOption value="total">Order total</NativeSelectOption>
					<NativeSelectOption value="customer">Customer</NativeSelectOption>
				</NativeSelect>
			</Field.Field>
			<Field.Field data-invalid class="w-auto">
				<Field.FieldLabel for="native-tray">Tray size</Field.FieldLabel>
				<NativeSelect id="native-tray" aria-invalid value="">
					<NativeSelectOption value="" disabled>Choose a tray</NativeSelectOption>
					<NativeSelectOption value="6">6 cells</NativeSelectOption>
					<NativeSelectOption value="15">15 cells</NativeSelectOption>
				</NativeSelect>
			</Field.Field>
			<Field.Field data-disabled class="w-auto">
				<Field.FieldLabel for="native-region">Delivery area</Field.FieldLabel>
				<NativeSelect id="native-region" disabled>
					<NativeSelectOption value="radius">Within {delivery.radiusMiles} miles of the shop</NativeSelectOption>
				</NativeSelect>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Select ----------------------------------------------------------- -->
	<Section
		id="select"
		title="Select"
		description="Picks one value from a short list in a paper popover. Use it when options need extra detail, like a price."
	>
		<Demo label="Plant, grouped with prices" layout="block">
			<Field.Field class="max-w-sm">
				<Field.FieldLabel for="select-plant">Plant</Field.FieldLabel>
				<Select.Root type="single" items={allStock} bind:value={pickedPlant}>
					<Select.Trigger id="select-plant" class="w-full">
						<Select.Value placeholder="Choose from stock" />
					</Select.Trigger>
					<Select.Content>
						{#each stock as group, i (group.heading)}
							{#if i > 0}
								<Select.Separator />
							{/if}
							<Select.Group>
								<Select.GroupHeading>{group.heading}</Select.GroupHeading>
								{#each group.items as p (p.value)}
									<Select.Item value={p.value} label={p.label} disabled={stockState(p.plant) === 'Sold out'}>
										<span class="truncate">{p.label}</span>
										<span class="ml-auto pl-4 text-muted-foreground tabular-nums">{priceLabel(p.plant)}</span>
									</Select.Item>
								{/each}
							</Select.Group>
						{/each}
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</Demo>

		<Demo label="On the cool block" tone="cool">
			<Field.Field class="w-full sm:w-64">
				<Field.FieldLabel for="select-assignee">Assign {radioOrder.id} to</Field.FieldLabel>
				<Select.Root type="single" items={staffItems} bind:value={assignee}>
					<Select.Trigger id="select-assignee" class="w-full">
						<Select.Value placeholder="Choose someone" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each staffItems as person (person.value)}
								<Select.Item value={person.value} label={person.label} />
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</Demo>

		<Demo label="Small, invalid and disabled" class="items-end">
			<Field.Field class="w-auto">
				<Field.FieldLabel for="select-view">Show</Field.FieldLabel>
				<Select.Root type="single" items={views} bind:value={view}>
					<Select.Trigger id="select-view" size="sm" class="min-w-40">
						<Select.Value />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each views as v (v.value)}
								<Select.Item value={v.value} label={v.label} />
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Field.Field data-invalid={!traySize} class="w-auto">
				<Field.FieldLabel for="select-tray">Tray size</Field.FieldLabel>
				<Select.Root type="single" bind:value={traySize}>
					<Select.Trigger id="select-tray" class="min-w-44" aria-invalid={!traySize ? true : undefined}>
						<Select.Value placeholder="Choose a tray" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value="6 cells" />
							<Select.Item value="15 cells" />
							<Select.Item value="40 plugs" />
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Field.Field data-disabled class="w-auto">
				<Field.FieldLabel for="select-season">Season</Field.FieldLabel>
				<Select.Root type="single" value="fall" items={[{ value: 'fall', label: 'Fall 2026' }]} disabled>
					<Select.Trigger id="select-season" class="min-w-40">
						<Select.Value placeholder="Fall 2026" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value="fall" label="Fall 2026" />
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Combobox, Command, Calendar, Range calendar, Date picker -------- -->
	<PickersSections />

	<!-- Checkbox --------------------------------------------------------- -->
	<Section
		id="checkbox"
		title="Checkbox"
		description="Turns one option on or off, or picks several from a list. Use a switch for settings that apply at once."
	>
		<Demo label="Pick list for order {pickOrder.id}" layout="block">
			<Field.FieldSet class="max-w-md">
				<Field.FieldLegend variant="label">Packed {pickedCount} of {pickList.length}</Field.FieldLegend>
				<Field.FieldDescription>
					{pickOrder.customer.name}, {formatDate(pickOrder.due!)}, {pickOrder.van}.
				</Field.FieldDescription>
				<Field.FieldGroup data-slot="checkbox-group">
					<Field.Field orientation="horizontal">
						<Checkbox
							id="pick-all"
							checked={pickedCount === pickList.length}
							indeterminate={pickedCount > 0 && pickedCount < pickList.length}
							onCheckedChange={(value) => pickList.forEach((item) => (item.picked = value))}
						/>
						<Field.FieldLabel for="pick-all">Everything on the order</Field.FieldLabel>
					</Field.Field>
					{#each pickList as item (item.id)}
						<Field.Field orientation="horizontal" class="pl-8">
							<Checkbox id="pick-{item.id}" bind:checked={item.picked} />
							<Field.FieldLabel for="pick-{item.id}" class="font-sans font-normal">
								{item.label}
								<span class="text-muted-foreground tabular-nums">× {item.qty}</span>
							</Field.FieldLabel>
						</Field.Field>
					{/each}
				</Field.FieldGroup>
			</Field.FieldSet>
		</Demo>

		<Demo label="Required, invalid and disabled" tone="warm" layout="block">
			<Field.FieldGroup data-slot="checkbox-group" class="max-w-lg">
				<Field.Field orientation="horizontal" data-invalid={termsTried && !termsAccepted}>
					<Checkbox
						id="terms"
						bind:checked={termsAccepted}
						aria-invalid={termsTried && !termsAccepted ? true : undefined}
					/>
					<Field.FieldContent>
						<Field.FieldLabel for="terms">I’ll plant bare-root roses within a week</Field.FieldLabel>
						{#if termsTried && !termsAccepted}
							<Field.FieldError>Tick this before we can ship bare-root stock.</Field.FieldError>
						{/if}
					</Field.FieldContent>
				</Field.Field>
				<Field.Field orientation="horizontal" data-disabled>
					<Checkbox id="gift-wrap" disabled />
					<Field.FieldContent>
						<Field.FieldLabel for="gift-wrap">Gift wrap, $3.40</Field.FieldLabel>
						<Field.FieldDescription>Out of paper until {formatLongDate(delivery.nextRuns[1])}.</Field.FieldDescription>
					</Field.FieldContent>
				</Field.Field>
			</Field.FieldGroup>
		</Demo>
	</Section>

	<!-- Radio group ------------------------------------------------------ -->
	<Section
		id="radio-group"
		title="Radio group"
		description="Picks exactly one option from a short list where every option should stay visible."
	>
		<Demo label="Delivery" layout="block">
			<Field.FieldSet>
				<Field.FieldLegend variant="label">How should we send order {radioOrder.id}?</Field.FieldLegend>
				<RadioGroup.Root bind:value={deliveryMethod}>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="van" id="radio-van" />
						<Field.FieldLabel for="radio-van" class="font-sans font-normal">
							{radioOrder.van} with Priya, {formatLongDate(radioOrder.due!)}, {radioSlot.label.toLowerCase()}, {formatMoney(radioFee)}
						</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="collect" id="radio-collect" />
						<Field.FieldLabel for="radio-collect" class="font-sans font-normal">Collect from the yard gate, free</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<RadioGroup.Item value="courier" id="radio-courier" disabled />
						<Field.FieldLabel for="radio-courier" class="font-sans font-normal">
							{formatLongDate(delivery.nextRuns[0])}, afternoon (full)
						</Field.FieldLabel>
					</Field.Field>
				</RadioGroup.Root>
			</Field.FieldSet>
		</Demo>

		<Demo label="On the ink card" tone="ink" layout="block">
			<Field.FieldSet>
				<Field.FieldLegend variant="label">Pot size for the hellebores</Field.FieldLegend>
				<RadioGroup.Root bind:value={potSize} class="flex flex-wrap gap-x-6 gap-y-3">
					{#each [{ v: '9cm', l: '9 cm' }, { v: '1l', l: '1 L' }, { v: '2l', l: '2 L' }, { v: '3l', l: '3 L' }] as size (size.v)}
						<Field.Field orientation="horizontal" class="w-auto">
							<RadioGroup.Item value={size.v} id="pot-{size.v}" />
							<Field.FieldLabel for="pot-{size.v}" class="font-sans font-normal">{size.l}</Field.FieldLabel>
						</Field.Field>
					{/each}
				</RadioGroup.Root>
			</Field.FieldSet>
		</Demo>
	</Section>

	<!-- Switch ----------------------------------------------------------- -->
	<Section
		id="switch"
		title="Switch"
		description="Turns a setting on or off straight away, with no save button."
	>
		<Demo label="Notifications for Nell" layout="block">
			<Field.FieldGroup class="max-w-xl">
				<Field.Field orientation="horizontal">
					<Field.FieldContent>
						<Field.FieldLabel for="switch-orders">New web orders</Field.FieldLabel>
						<Field.FieldDescription>An email for each order, as it comes in.</Field.FieldDescription>
					</Field.FieldContent>
					<Switch id="switch-orders" bind:checked={notifyOrders} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.FieldContent>
						<Field.FieldLabel for="switch-stock">Low stock</Field.FieldLabel>
						<Field.FieldDescription>When a plant drops to 12 or fewer.</Field.FieldDescription>
					</Field.FieldContent>
					<Switch id="switch-stock" bind:checked={notifyStock} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.FieldContent>
						<Field.FieldLabel for="switch-route">Text Priya the route</Field.FieldLabel>
						<Field.FieldDescription>At 7:00 AM on {runDays}.</Field.FieldDescription>
					</Field.FieldContent>
					<Switch id="switch-route" bind:checked={notifyRoute} />
				</Field.Field>
				<Field.Field orientation="horizontal" data-disabled>
					<Field.FieldContent>
						<Field.FieldLabel for="switch-sales">Weekly sales summary</Field.FieldLabel>
						<Field.FieldDescription>June turned this off for everyone while she changes banks.</Field.FieldDescription>
					</Field.FieldContent>
					<Switch id="switch-sales" disabled />
				</Field.Field>
			</Field.FieldGroup>
		</Demo>

		<Demo label="Small, on the ink card" tone="ink" layout="block">
			<Field.FieldGroup class="max-w-sm gap-4">
				<Field.Field orientation="horizontal">
					<Field.FieldLabel for="switch-tax">Show prices with tax</Field.FieldLabel>
					<Switch id="switch-tax" size="sm" bind:checked={pricesWithTax} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.FieldLabel for="switch-oos">Show sold-out plants</Field.FieldLabel>
					<Switch id="switch-oos" size="sm" bind:checked={showOutOfStock} />
				</Field.Field>
			</Field.FieldGroup>
		</Demo>
	</Section>

	<!-- Slider ----------------------------------------------------------- -->
	<Section
		id="slider"
		title="Slider"
		description="Sets a number in a known range by dragging. Show the value next to it."
	>
		<Demo label="Bare-root roses" layout="block">
			<Field.Field class="max-w-md">
				<div class="flex items-baseline justify-between gap-4">
					<Field.FieldTitle>How many roses</Field.FieldTitle>
					<span class="font-display text-sm font-bold tabular-nums">{roses}</span>
				</div>
				<Slider type="single" min={1} max={48} step={1} bind:value={roses} />
				<Field.FieldDescription class="tabular-nums">
					{plants.rose.name}, {formatMoney(roseUnit)} each, {formatMoney(roseUnit * roses)} in all. Trade price from
					{ROSE_TRADE_FROM} roses: {formatMoney(ROSE_TRADE_PRICE)} each.
				</Field.FieldDescription>
			</Field.Field>
		</Demo>

		<Demo label="Price range" tone="cool" layout="block">
			<Field.Field class="max-w-md">
				<div class="flex items-baseline justify-between gap-4">
					<Field.FieldTitle>Price</Field.FieldTitle>
					<span class="font-display text-sm font-bold tabular-nums">
						{formatMoney(priceRange[0])} to {formatMoney(priceRange[1])}
					</span>
				</div>
				<Slider type="multiple" min={priceMin} max={priceMax} step={0.5} bind:value={priceRange} />
				<Field.FieldDescription class="tabular-nums">
					{inRange.length === 1 ? '1 plant' : `${inRange.length} plants`} in that range.
				</Field.FieldDescription>
			</Field.Field>
		</Demo>

		<Demo label="Disabled, on the ink card" tone="ink" layout="block">
			<Field.Field class="max-w-md" data-disabled>
				<div class="flex items-baseline justify-between gap-4">
					<Field.FieldTitle>Delivery radius</Field.FieldTitle>
					<span class="font-display text-sm font-bold tabular-nums">{delivery.radiusMiles} miles</span>
				</div>
				<Slider type="single" min={5} max={30} value={delivery.radiusMiles} disabled />
				<p class="text-sm">Set by Nell. Van 2 keeps to the same area when Tomasz drives it.</p>
			</Field.Field>
		</Demo>
	</Section>
</CatalogPage>
