<script lang="ts">
	import { toast } from 'svelte-sonner';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import InfoIcon from '@lucide/svelte/icons/info';
	import MailIcon from '@lucide/svelte/icons/mail';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import XIcon from '@lucide/svelte/icons/x';
	import { CatalogPage, Demo, Section } from '#lib/components/showcase/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Kbd, KbdGroup } from '#lib/components/ui/kbd/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as Drawer from '#lib/components/ui/drawer/index.js';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as HoverCard from '#lib/components/ui/hover-card/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import {
		TODAY,
		delivery,
		formatLongDate,
		formatMoney,
		formatTime,
		lineTotal,
		order,
		orderDeliveryFee,
		orderItems,
		orderTotal,
		orders as ledger,
		plantList,
		plants,
		shop,
		shortcuts,
		staff,
		statusBadge,
		stockTake,
		weather,
		type OrderStatus
	} from '#lib/demos/world.js';

	const sections = [
		{ id: 'dialog', title: 'Dialog' },
		{ id: 'alert-dialog', title: 'Alert dialog' },
		{ id: 'sheet', title: 'Sheet' },
		{ id: 'drawer', title: 'Drawer' },
		{ id: 'popover', title: 'Popover' },
		{ id: 'hover-card', title: 'Hover card' },
		{ id: 'tooltip', title: 'Tooltip' },
		{ id: 'sonner', title: 'Sonner' },
		{ id: 'alert', title: 'Alert' },
		{ id: 'progress', title: 'Progress' },
		{ id: 'skeleton', title: 'Skeleton' },
		{ id: 'spinner', title: 'Spinner' }
	];

	const count = new Intl.NumberFormat('en-US');
	const run = delivery.todayRun;
	const firstName = (name: string) => name.split(' ')[0];

	/* Marguerite's two orders: #4474 is on the van now, #4479 goes out next Tuesday. */
	const outNow = order('#4474');
	const nextUp = order('#4479');
	const slotWindow = (id: string | undefined) => delivery.slots.find((s) => s.id === id)?.window ?? '';

	/* Dialog: edit the delivery address on #4479. */
	let addressOpen = $state(false);
	let address = $state({
		street: nextUp.customer.street,
		town: nextUp.customer.town,
		zip: nextUp.customer.zip,
		note: outNow.note ?? ''
	});
	let draft = $state({ street: '', town: '', zip: '', note: '' });
	let streetMissing = $state(false);

	function openAddress(open: boolean) {
		if (open) {
			draft = { ...address };
			streetMissing = false;
		}
	}

	function saveAddress(event: SubmitEvent) {
		event.preventDefault();
		if (!draft.street.trim()) {
			streetMissing = true;
			return;
		}
		address = { ...draft };
		addressOpen = false;
		toast.success('Delivery address updated', { description: `Order ${nextUp.id} now goes to ${address.street}.` });
	}

	/* Alert dialog: cancel order #4479. */
	let cancelOpen = $state(false);
	let nextUpStatus = $state<OrderStatus>(nextUp.status);
	const nextUpTotal = formatMoney(orderTotal(nextUp));
	let draftNoteOpen = $state(false);
	let draftNoteDeleted = $state(false);

	/* Sheet: #4474's details. */
	type Side = 'right' | 'left' | 'top' | 'bottom';
	let sheetSide = $state<Side>('right');
	let sheetOpen = $state(false);
	let outNowStatus = $state<OrderStatus>(outNow.status);
	const outNowFee = orderDeliveryFee(outNow);

	/* Popover: #4474's note for the driver. */
	let notesOpen = $state(false);
	let notes = $state(outNow.note ?? '');
	let notesDraft = $state('');

	/* Tooltip: an order row's icon buttons. Only the print action has a shortcut. */
	const tools = [
		{ label: shortcuts.print.label, icon: PrinterIcon, keys: shortcuts.print.keys as readonly string[] },
		{ label: 'Copy order number', icon: CopyIcon, keys: [] },
		{ label: `Email ${outNow.customer.name}`, icon: MailIcon, keys: [] },
		{ label: 'Archive order', icon: ArchiveIcon, keys: [] }
	];

	/* Sonner. */
	function markDelivered() {
		const before = outNowStatus;
		outNowStatus = 'Delivered';
		toast.success(`Order ${outNow.id} marked delivered`, {
			description: `${firstName(run.driver.name)} left it by ${firstName(outNow.customer.name)}’s side gate at 10:42 AM.`,
			action: {
				label: 'Undo',
				onClick: () => {
					outNowStatus = before;
				}
			}
		});
	}

	const invoiceOrder = order('#4476');
	function sendInvoice() {
		toast.error(`Invoice for ${invoiceOrder.id} not sent`, {
			description: `The mail server didn’t answer, so ${invoiceOrder.customer.name} has nothing yet. Try again in a minute.`,
			duration: 8000
		});
	}

	function syncStock() {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
			loading: 'Syncing stock with the till…',
			success: `${plantList.length} plants synced. No prices changed.`,
			error: 'Stock sync failed.'
		});
	}

	/* Alert. The frost warning splits into a title and an instruction. */
	const frostCut = weather.frostWarning.indexOf('. ');
	const frostTitle = weather.frostWarning.slice(0, frostCut);
	const frostAction = weather.frostWarning.slice(frostCut + 2);
	let frostDismissed = $state(false);
	const vanService = '2026-10-28';

	/* Progress: import the stock take. */
	const importTotal = stockTake.counted;
	let imported = $state(0);
	let importing = $state(false);
	const importDone = $derived(imported >= importTotal);

	$effect(() => {
		if (!importing) return;
		const id = setInterval(() => {
			const step = 37 + Math.floor(Math.random() * 61);
			imported = Math.min(importTotal, imported + step);
			if (imported >= importTotal) importing = false;
		}, 180);
		return () => clearInterval(id);
	});

	function startImport() {
		imported = 0;
		importing = true;
	}

	/* Progress on the ink card: Rosa's collection, packed one item at a time. */
	const packing = order('#4481');

	/* Skeleton: today's new orders, reloading. */
	let ordersLoading = $state(true);
	let ordersFailed = $state(false);
	const todays = ledger.filter((o) => o.placed === TODAY);

	$effect(() => {
		if (!ordersLoading) return;
		const id = setTimeout(() => (ordersLoading = false), 1600);
		return () => clearTimeout(id);
	});

	function reloadOrders(fail = false) {
		ordersFailed = fail;
		ordersLoading = true;
	}

	/* Spinner: busy buttons. Labels for Saturday's run. */
	const labelCount = ledger.filter((o) => o.fulfilment === 'delivery' && o.due === delivery.nextRuns[0]).length;
	let saving = $state(false);
	let printing = $state(false);

	function fakeWork(set: (v: boolean) => void, ms: number) {
		set(true);
		setTimeout(() => set(false), ms);
	}
</script>

{#snippet toolbar()}
	<div class="flex items-center gap-1" role="toolbar" aria-label="Order {outNow.id}">
		{#each tools as tool (tool.label)}
			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })} aria-label={tool.label}>
					<tool.icon />
				</Tooltip.Trigger>
				<Tooltip.Content>
					{tool.label}
					{#if tool.keys.length}
						<KbdGroup>
							{#each tool.keys as key (key)}<Kbd>{key}</Kbd>{/each}
						</KbdGroup>
					{/if}
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
{/snippet}

<CatalogPage group="overlays" {sections}>
	<Section id="dialog" title="Dialog" description="For a short task that needs the person’s full attention, like editing one record.">
		<Demo label="Edit a delivery address" layout="block">
			<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="min-w-0">
					<p class="font-display font-bold">Order {nextUp.id}, {nextUp.customer.name}</p>
					<p class="mt-1 text-[0.9375rem] text-muted-foreground">
						{address.street}, {address.town}, {shop.address.state} {address.zip}
					</p>
				</div>
				<Dialog.Root bind:open={addressOpen} onOpenChange={openAddress}>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Edit address</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Delivery address</Dialog.Title>
							<Dialog.Description>
								Goes out {formatLongDate(nextUp.due ?? TODAY)}, {slotWindow(nextUp.slot)}. {firstName(run.driver.name)}
								sees the change on the van.
							</Dialog.Description>
						</Dialog.Header>
						<form id="address-form" onsubmit={saveAddress} novalidate>
							<Field.Group>
								<Field.Field data-invalid={streetMissing || undefined}>
									<Field.Label for="addr-street">Street</Field.Label>
									<Input
										id="addr-street"
										bind:value={draft.street}
										aria-invalid={streetMissing || undefined}
										autocomplete="address-line1"
									/>
									{#if streetMissing}
										<Field.Error>Add a street so {firstName(run.driver.name)} can find the house.</Field.Error>
									{/if}
								</Field.Field>
								<div class="grid gap-5 sm:grid-cols-[1fr_9rem]">
									<Field.Field>
										<Field.Label for="addr-town">Town</Field.Label>
										<Input id="addr-town" bind:value={draft.town} autocomplete="address-level2" />
									</Field.Field>
									<Field.Field>
										<Field.Label for="addr-zip">ZIP code</Field.Label>
										<Input id="addr-zip" bind:value={draft.zip} autocomplete="postal-code" inputmode="numeric" />
									</Field.Field>
								</div>
								<Field.Field>
									<Field.Label for="addr-note">Note for the driver</Field.Label>
									<Input id="addr-note" bind:value={draft.note} />
								</Field.Field>
							</Field.Group>
						</form>
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" form="address-form">Save address</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Demo>
	</Section>

	<Section id="alert-dialog" title="Alert dialog" description="For a confirmation that can’t be undone. It only closes when the person picks an answer.">
		<Demo label="Cancel an order" layout="block">
			<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="min-w-0">
					<p class="flex flex-wrap items-center gap-2 font-display font-bold">
						Order {nextUp.id}, {nextUp.customer.name}
						<Badge variant={statusBadge[nextUpStatus]}>{nextUpStatus}</Badge>
					</p>
					<p class="mt-1 text-[0.9375rem] text-muted-foreground tabular-nums">
						{orderItems(nextUp)} items, {nextUpTotal}
					</p>
				</div>
				{#if nextUpStatus === 'Cancelled'}
					<Button variant="outline" size="sm" onclick={() => (nextUpStatus = nextUp.status)}>Restore order</Button>
				{:else}
					<AlertDialog.Root bind:open={cancelOpen}>
						<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'sm' })}>Cancel order</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Cancel order {nextUp.id}?</AlertDialog.Title>
								<AlertDialog.Description>
									{firstName(nextUp.customer.name)} gets {nextUpTotal} back on her card and the {orderItems(nextUp)} hellebores
									go back in the {plants.hellebore.location.toLowerCase()}. The order can’t be reopened after this.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Keep order</AlertDialog.Cancel>
								<AlertDialog.Action
									onclick={() => {
										nextUpStatus = 'Cancelled';
										cancelOpen = false;
										toast(`Order ${nextUp.id} cancelled`, {
											description: `${nextUpTotal} refunded to ${nextUp.customer.name}.`
										});
									}}
								>
									Cancel order
								</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/if}
			</div>
		</Demo>
		<Demo label="Small, from the ink card" tone="ink" layout="block">
			<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
				<p class="min-w-0 text-[0.9375rem]">
					{draftNoteDeleted
						? 'Draft deleted.'
						: `Draft note to ${firstName(staff.tomasz.name)}: “Pot on the witch hazel cuttings before Friday.”`}
				</p>
				{#if draftNoteDeleted}
					<Button variant="outline" size="sm" onclick={() => (draftNoteDeleted = false)}>Bring it back</Button>
				{:else}
					<AlertDialog.Root bind:open={draftNoteOpen}>
						<AlertDialog.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Delete draft</AlertDialog.Trigger>
						<AlertDialog.Content size="sm">
							<AlertDialog.Header>
								<AlertDialog.Title>Delete this draft?</AlertDialog.Title>
								<AlertDialog.Description>{firstName(staff.tomasz.name)} hasn’t seen it yet.</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Keep</AlertDialog.Cancel>
								<AlertDialog.Action
									onclick={() => {
										draftNoteDeleted = true;
										draftNoteOpen = false;
									}}
								>
									Delete
								</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/if}
			</div>
		</Demo>
	</Section>

	<Section id="sheet" title="Sheet" description="For details that sit beside the page, like an order opened from a list.">
		<Demo label="Order details" layout="stack">
			<ToggleGroup.Root type="single" variant="outline" size="sm" bind:value={sheetSide} aria-label="Sheet side" class="flex-wrap">
				<ToggleGroup.Item value="right">Right</ToggleGroup.Item>
				<ToggleGroup.Item value="left">Left</ToggleGroup.Item>
				<ToggleGroup.Item value="top">Top</ToggleGroup.Item>
				<ToggleGroup.Item value="bottom">Bottom</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger class={buttonVariants({ class: 'self-start' })}>Open order {outNow.id}</Sheet.Trigger>
				<Sheet.Content side={sheetSide}>
					<Sheet.Header>
						<Sheet.Title>Order {outNow.id}</Sheet.Title>
						<Sheet.Description>{outNow.customer.name}, placed {formatLongDate(outNow.placed)}.</Sheet.Description>
					</Sheet.Header>
					<div class="min-h-0 flex-1 overflow-y-auto px-6 md:px-8">
						<ul class="border-t">
							{#each outNow.lines as line (line.plant.id)}
								<li class="flex items-baseline justify-between gap-4 border-b py-3 text-[0.9375rem]">
									<span class="min-w-0">{line.plant.name} <span class="text-muted-foreground">× {line.qty}</span></span>
									<span class="shrink-0 tabular-nums">{formatMoney(lineTotal(line))}</span>
								</li>
							{/each}
							<li class="flex items-baseline justify-between gap-4 border-b py-3 text-[0.9375rem] text-muted-foreground">
								<span>Delivery</span>
								<span class="tabular-nums">{outNowFee === 0 ? 'Free' : formatMoney(outNowFee)}</span>
							</li>
						</ul>
						<p class="flex items-baseline justify-between py-4 font-display text-lg font-extrabold">
							<span>Total</span>
							<span class="tabular-nums">{formatMoney(orderTotal(outNow))}</span>
						</p>
						<dl class="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2 pb-2 text-[0.9375rem]">
							<dt class="text-muted-foreground">Status</dt>
							<dd><Badge variant={statusBadge[outNowStatus]}>{outNowStatus}</Badge></dd>
							<dt class="text-muted-foreground">Address</dt>
							<dd>{outNow.customer.street}, {outNow.customer.town}, {shop.address.state} {outNow.customer.zip}</dd>
							<dt class="text-muted-foreground">Slot</dt>
							<dd class="tabular-nums">{formatLongDate(outNow.due ?? TODAY)}, {slotWindow(outNow.slot)}</dd>
							<dt class="text-muted-foreground">Driver</dt>
							<dd>{run.driver.name}, {outNow.van}</dd>
						</dl>
					</div>
					<Sheet.Footer class="flex-col-reverse sm:flex-row sm:justify-end">
						<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
						<Button
							disabled={outNowStatus === 'Delivered'}
							onclick={() => {
								sheetOpen = false;
								markDelivered();
							}}
						>
							{outNowStatus === 'Delivered' ? 'Delivered' : 'Mark delivered'}
						</Button>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>
		</Demo>
	</Section>

	<Section id="drawer" title="Drawer" description="A sheet from the bottom edge that can be dragged shut. Best on phones.">
		<Demo label="Care notes, from the warm block" tone="warm" layout="block">
			<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="min-w-0">
					<p class="font-display font-bold">{plants.hellebore.name}</p>
					<p class="mt-1 text-[0.9375rem] tabular-nums">
						{plants.hellebore.form}, {formatMoney(plants.hellebore.price)}. {plants.hellebore.stock} in the
						{plants.hellebore.location.toLowerCase()}.
					</p>
				</div>
				<Drawer.Root>
					<Drawer.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Care notes</Drawer.Trigger>
					<Drawer.Content>
						<div class="mx-auto flex w-full max-w-xl min-h-0 flex-col">
							<Drawer.Header>
								<Drawer.Title>{plants.hellebore.name}</Drawer.Title>
								<Drawer.Description>{plants.hellebore.care}</Drawer.Description>
							</Drawer.Header>
							<dl class="mx-6 overflow-y-auto border-t md:mx-8">
								{#each [['Light', 'Part shade. Under deciduous trees is ideal.'], ['Soil', 'Rich and well drained. Tolerates clay.'], ['Water', 'Keep moist the first summer, then only in drought.'], ['Tidy', 'Cut the old leaves back in December so the flowers show.']] as [term, text] (term)}
									<div class="grid grid-cols-[5rem_1fr] gap-4 border-b py-3 text-[0.9375rem]">
										<dt class="font-display font-bold">{term}</dt>
										<dd>{text}</dd>
									</div>
								{/each}
							</dl>
							<Drawer.Footer class="flex-col-reverse sm:flex-row sm:justify-end">
								<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
								<Drawer.Close class={buttonVariants()} onclick={() => toast('Care card sent to the shop printer')}>
									Print care card
								</Drawer.Close>
							</Drawer.Footer>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		</Demo>
	</Section>

	<Section id="popover" title="Popover" description="For a small panel tied to one control: a note, a quick setting, a filter.">
		<Demo label="Delivery notes, on the cool block" tone="cool" layout="block">
			<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="min-w-0">
					<p class="font-display font-bold">{outNow.id}, {formatLongDate(outNow.due ?? TODAY)}, {outNow.van}</p>
					<p class="mt-1 text-[0.9375rem]">
						{notes ? `Note: ${notes}` : 'No note for the driver.'}
					</p>
				</div>
				<Popover.Root
					bind:open={notesOpen}
					onOpenChange={(open) => {
						if (open) notesDraft = notes;
					}}
				>
					<Popover.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Delivery notes</Popover.Trigger>
					<Popover.Content align="end" class="w-80">
						<Popover.Header>
							<Popover.Title>Note for {firstName(run.driver.name)}</Popover.Title>
							<Popover.Description>Shown on the van tablet at the door.</Popover.Description>
						</Popover.Header>
						<Field.Field>
							<Field.Label for="delivery-note" class="sr-only">Note</Field.Label>
							<Textarea id="delivery-note" bind:value={notesDraft} rows={3} />
						</Field.Field>
						<div class="flex justify-end gap-2">
							<Button variant="ghost" size="sm" onclick={() => (notesOpen = false)}>Cancel</Button>
							<Button
								size="sm"
								onclick={() => {
									notes = notesDraft.trim();
									notesOpen = false;
								}}
							>
								Save note
							</Button>
						</div>
					</Popover.Content>
				</Popover.Root>
			</div>
		</Demo>
	</Section>

	<Section id="hover-card" title="Hover card" description="A preview of a person or record behind a link. Keep anything essential out of it: touch screens never see it.">
		<Demo label="A staff name in an order log">
			<p class="text-[0.9375rem]">
				{order('#4475').id} packed by
				<HoverCard.Root openDelay={250}><HoverCard.Trigger href="mailto:{staff.priya.email}" class="text-link">{staff.priya.name}</HoverCard.Trigger><HoverCard.Content class="flex gap-4">
						<Avatar.Root class="size-11">
							<Avatar.Fallback>{staff.priya.initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex min-w-0 flex-col gap-1">
							<p class="font-display font-bold">{staff.priya.name}</p>
							<p class="text-sm text-muted-foreground">{staff.priya.role}, {delivery.days.join(', ').replace(/, (?=[^,]*$)/, ' and ')}</p>
							<p class="mt-2 text-sm">
								Out on {run.van} since {formatTime(run.left)}, {run.stops} stops today.
							</p>
							<p class="truncate text-sm text-muted-foreground">{staff.priya.email}</p>
						</div>
					</HoverCard.Content></HoverCard.Root>
				on {formatLongDate('2026-10-21')} at 3:05 PM, checked by
				<HoverCard.Root openDelay={250}><HoverCard.Trigger href="mailto:{staff.nell.email}" class="text-link">{staff.nell.name}</HoverCard.Trigger><HoverCard.Content class="flex gap-4">
						<Avatar.Root class="size-11">
							<Avatar.Fallback>{staff.nell.initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex min-w-0 flex-col gap-1">
							<p class="font-display font-bold">{staff.nell.name}</p>
							<p class="text-sm text-muted-foreground">{staff.nell.role}</p>
							<p class="mt-2 text-sm">In the shop until close at 5:00 PM. Signs off any refund over $50.00.</p>
							<p class="truncate text-sm text-muted-foreground">{staff.nell.email}</p>
						</div>
					</HoverCard.Content></HoverCard.Root>.
			</p>
		</Demo>
	</Section>

	<Section id="tooltip" title="Tooltip" description="Names an icon button. One short line, never anything the person must read to finish a task.">
		<Tooltip.Provider delayDuration={200}>
			<Demo label="Icon buttons on an order row">
				<span class="font-display font-bold">{outNow.id}</span>
				{@render toolbar()}
			</Demo>
			<Demo label="On the ink card" tone="ink">
				<span class="font-display font-bold">{outNow.id}</span>
				{@render toolbar()}
			</Demo>
		</Tooltip.Provider>
	</Section>

	<Section id="sonner" title="Sonner" description="A toast confirms something that already happened and offers a way back. Errors stay up longer.">
		<Demo label="Success with undo, error, and a slow task">
			<Button onclick={markDelivered} disabled={outNowStatus === 'Delivered'}>Mark {outNow.id} delivered</Button>
			<Button variant="outline" onclick={sendInvoice}>Send invoice for {invoiceOrder.id}</Button>
			<Button variant="ghost" onclick={syncStock}>Sync stock</Button>
			<p class="w-full text-sm text-muted-foreground">Order {outNow.id}: {outNowStatus.toLowerCase()}</p>
		</Demo>
	</Section>

	<Section id="alert" title="Alert" description="A message that stays on the page until the problem is gone. Not for confirmations; use a toast.">
		<Demo label="Variants" layout="block" frame={false}>
			<div class="flex flex-col gap-4">
				<Alert.Root>
					<TriangleAlertIcon />
					<Alert.Title>{frostTitle}</Alert.Title>
					<Alert.Description>{frostAction}</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="destructive">
					<OctagonXIcon />
					<Alert.Title>Tunnel 2 heater is off</Alert.Title>
					<Alert.Description>
						It stopped at 4:12 AM and the tunnel is down to 35°F, with {plants.foxglove.stock} foxglove ‘Pam’s Choice’
						inside. {firstName(staff.tomasz.name)} is on his way in.
					</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="accent">
					<InfoIcon />
					<Alert.Title>Bare-root roses arrive {formatLongDate(plants.rose.arrives)}</Alert.Title>
					<Alert.Description>
						116 plants from Ellery’s, {plants.rose.reserved} already reserved. Clear the heeling-in bed by
						{formatLongDate('2026-11-08')}.
					</Alert.Description>
				</Alert.Root>
				{#if frostDismissed}
					<Button variant="link" class="self-start" onclick={() => (frostDismissed = false)}>
						Show the weekend warning again
					</Button>
				{:else}
					<Alert.Root variant="secondary">
						<TriangleAlertIcon />
						<Alert.Title>Hard frost likely this weekend</Alert.Title>
						<Alert.Description>Fleece the young witch hazels in the tree row on Friday afternoon.</Alert.Description>
						<Alert.Action>
							<Button variant="ghost" size="icon-sm" aria-label="Dismiss" onclick={() => (frostDismissed = true)}>
								<XIcon />
							</Button>
						</Alert.Action>
					</Alert.Root>
				{/if}
			</div>
		</Demo>
		<Demo label="On the ink card" tone="ink" layout="block" frame={false}>
			<Alert.Root>
				<TriangleAlertIcon />
				<Alert.Title>Van 2 goes in for its service</Alert.Title>
				<Alert.Description>
					{formatLongDate(vanService)}, a day with no run. {firstName(staff.tomasz.name)} drops it off at 9:00 AM and it is
					back for {formatLongDate(delivery.nextRuns[2])}.
				</Alert.Description>
			</Alert.Root>
		</Demo>
	</Section>

	<Section id="progress" title="Progress" description="For a task with a known size. Say what is happening and how far along it is.">
		<Demo label="Importing the stock take" layout="stack">
			<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
				<p id="import-label" class="font-display font-bold">
					{#if importDone}
						Import finished
					{:else if importing}
						Importing plants
					{:else}
						Stock take, {formatLongDate(stockTake.date)}
					{/if}
				</p>
				<p class="text-sm text-muted-foreground tabular-nums">
					{count.format(imported)} of {count.format(importTotal)} plants
				</p>
			</div>
			<Progress value={imported} max={importTotal} aria-labelledby="import-label" />
			{#if importDone}
				<p class="text-sm">
					{stockTake.skipped} rows skipped: their codes match no plant. {firstName(stockTake.by.name)} will check them.
				</p>
			{/if}
			<Button variant="outline" size="sm" class="self-start" onclick={startImport} disabled={importing}>
				{#if importing}
					<Spinner data-icon="inline-start" />
					Importing
				{:else if importDone}
					Run again
				{:else}
					Import {count.format(importTotal)} plants
				{/if}
			</Button>
		</Demo>
		<Demo label="On the ink card" tone="ink" layout="stack">
			<div class="flex items-baseline justify-between gap-4">
				<p id="packing-label" class="font-display font-bold">Packing {packing.id} for collection</p>
				<p class="text-sm tabular-nums">3 of {orderItems(packing)} items</p>
			</div>
			<Progress value={3} max={orderItems(packing)} aria-labelledby="packing-label" />
		</Demo>
	</Section>

	<Section id="skeleton" title="Skeleton" description="Holds the shape of content that is on its way, so the page doesn’t jump when it lands.">
		<Demo label="Today’s new orders" layout="stack">
			<div class="flex flex-wrap gap-3">
				<Button variant="outline" size="sm" onclick={() => reloadOrders()} disabled={ordersLoading}>Reload</Button>
				<Button variant="ghost" size="sm" onclick={() => reloadOrders(true)} disabled={ordersLoading}>
					Reload with an error
				</Button>
			</div>
			<ul class="border-t" aria-busy={ordersLoading} aria-label="Today’s new orders">
				{#if ordersLoading}
					{#each todays as o (o.id)}
						<li class="flex items-center gap-4 border-b py-4" aria-hidden="true">
							<Skeleton class="h-4 w-12" />
							<div class="flex min-w-0 flex-1 flex-col gap-2">
								<Skeleton class="h-4 w-36 max-w-full" />
								<Skeleton class="h-3 w-16" />
							</div>
							<Skeleton class="h-4 w-16" />
						</li>
					{/each}
				{:else if ordersFailed}
					<li class="flex flex-col gap-3 border-b py-6">
						<p class="font-display font-bold">Orders didn’t load</p>
						<p class="text-[0.9375rem] text-muted-foreground">
							The till didn’t answer. Your orders are safe; try again in a minute.
						</p>
						<Button variant="outline" size="sm" class="self-start" onclick={() => reloadOrders()}>Try again</Button>
					</li>
				{:else}
					{#each todays as o (o.id)}
						<li class="flex items-center gap-4 border-b py-4">
							<span class="w-14 font-display font-bold tabular-nums">{o.id}</span>
							<div class="flex min-w-0 flex-1 flex-col">
								<span class="truncate">{o.customer.name}</span>
								<span class="text-sm text-muted-foreground">
									{orderItems(o)}
									{orderItems(o) === 1 ? 'item' : 'items'}, {o.fulfilment}, {o.status.toLowerCase()}
								</span>
							</div>
							<span class="tabular-nums">{formatMoney(orderTotal(o))}</span>
						</li>
					{/each}
				{/if}
			</ul>
		</Demo>
	</Section>

	<Section id="spinner" title="Spinner" description="For a short wait with no known length. Put it in the button that started the work, with a label.">
		<Demo label="Inside buttons">
			<Button disabled={saving} onclick={() => fakeWork((v) => (saving = v), 1600)}>
				{#if saving}
					<Spinner data-icon="inline-start" />
					Saving
				{:else}
					Save address
				{/if}
			</Button>
			<Button variant="outline" disabled={printing} onclick={() => fakeWork((v) => (printing = v), 2200)}>
				{#if printing}
					<Spinner data-icon="inline-start" />
					Printing {labelCount} labels
				{:else}
					Print {labelCount} labels for {formatLongDate(delivery.nextRuns[0]).split(',')[0]}
				{/if}
			</Button>
			<Button variant="secondary" size="sm" disabled>
				<Spinner data-icon="inline-start" />
				Checking stock
			</Button>
		</Demo>
		<Demo label="With a label, on the ink card" tone="ink">
			<p class="flex items-center gap-3 text-[0.9375rem]" role="status">
				<Spinner aria-hidden="true" role="presentation" class="size-5" />
				Checking the {plants.witchHazel.location.toLowerCase()} for witch hazel…
			</p>
		</Demo>
	</Section>
</CatalogPage>
