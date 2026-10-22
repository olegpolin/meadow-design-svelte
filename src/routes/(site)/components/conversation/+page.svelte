<script lang="ts">
	import { onDestroy } from 'svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import FileSpreadsheetIcon from '@lucide/svelte/icons/file-spreadsheet';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';
	import TruckIcon from '@lucide/svelte/icons/truck';
	import XIcon from '@lucide/svelte/icons/x';
	import { CatalogPage, Section, Demo } from '#lib/components/showcase/index.js';
	import * as Attachment from '#lib/components/ui/attachment/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Bubble from '#lib/components/ui/bubble/index.js';
	import * as CodeBlock from '#lib/components/ui/code-block/index.js';
	import * as Marker from '#lib/components/ui/marker/index.js';
	import * as Message from '#lib/components/ui/message/index.js';
	import * as MessageScroller from '#lib/components/ui/message-scroller/index.js';
	import * as Questionnaire from '#lib/components/ui/questionnaire/index.js';
	import * as Trace from '#lib/components/ui/trace/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import { useHighlightedCode } from '#lib/hooks/use-highlighted-code.svelte.js';
	import {
		TODAY,
		customers,
		delivery,
		formatLongDate,
		formatMoney,
		formatTime,
		order,
		orderDeliveryFee,
		orderTotal,
		orders,
		plants,
		shop,
		staff,
		stockState,
		weather
	} from '#lib/demos/world.js';

	/* The world: Hal's rose pre-order and his foxgloves for Saturday. */
	const halJennings = customers.hal;
	const nellOkafor = staff.nell;
	const priya = staff.priya;
	const roses = order('#4471');
	const foxgloves = order('#4482');
	const rose = plants.rose;
	const slotWindow = (id: 'am' | 'pm' | undefined) => delivery.slots.find((s) => s.id === id)?.window ?? '';
	const roseDay = formatLongDate(roses.due!);
	const roseArrives = formatLongDate(rose.arrives);
	const roseWindow = slotWindow(roses.slot);
	const roseTotal = formatMoney(orderTotal(roses));
	const todayLong = formatLongDate(TODAY);
	const firstName = (name: string) => name.split(' ')[0];
	const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

	/** "9:21 AM" for a time this morning. */
	function at(minutes: number) {
		const h = String(9 + Math.floor(minutes / 60)).padStart(2, '0');
		const m = String(minutes % 60).padStart(2, '0');
		return formatTime(`${TODAY}T${h}:${m}:00`);
	}

	const sections = [
		{ id: 'message', title: 'Message' },
		{ id: 'message-scroller', title: 'Message scroller' },
		{ id: 'bubble', title: 'Bubble' },
		{ id: 'attachment', title: 'Attachment' },
		{ id: 'code-block', title: 'Code block' },
		{ id: 'marker', title: 'Marker' },
		{ id: 'trace', title: 'Trace' },
		{ id: 'questionnaire', title: 'Questionnaire' }
	];

	const timers = new Set<ReturnType<typeof setTimeout>>();
	function later(ms: number, fn: () => void) {
		const id = setTimeout(() => {
			timers.delete(id);
			fn();
		}, ms);
		timers.add(id);
	}
	onDestroy(() => timers.forEach(clearTimeout));

	/* ------------------------------------------------------ Message scroller */
	type Line = { id: number; from: 'hal' | 'nell'; text: string; time: string };

	let nextId = 100;
	let thread = $state<Line[]>([
		{ id: 1, from: 'hal', time: at(2), text: `Morning. ${capitalize(weather.source)} says ${weather.frostLow} tonight. Are my roses on order ${roses.id} going to be all right?` },
		{ id: 2, from: 'nell', time: at(6), text: `Morning, ${firstName(halJennings.name)}. They're fine. They're still dormant at the grower and land here on ${roseArrives}.` },
		{ id: 3, from: 'nell', time: at(6), text: `Priya brings them on the ${roseDay} morning run, ${roseWindow}.` },
		{ id: 4, from: 'hal', time: at(11), text: 'Can they come any sooner?' },
		{ id: 5, from: 'nell', time: at(14), text: "Not before they land. Tomasz checks every rose the day they arrive, then they wait in the cold store wrapped in damp burlap." },
		{ id: 6, from: 'hal', time: at(15), text: 'Fine. Is there anything I should do to the bed in the meantime?' },
		{ id: 7, from: 'nell', time: at(19), text: "Cover it with cardboard or a few inches of chopped leaves tonight. It keeps the top of the soil workable, so you can plant the day they arrive." },
		{ id: 8, from: 'hal', time: at(22), text: 'I have plenty of leaves. Doing it after lunch.' }
	]);

	const replies = [
		`Noted. I've added that to Priya's delivery sheet for ${halJennings.street}.`,
		`Tomasz says yours are three ${rose.name.replace(/^Bare-root rose /, '')}. Soak the roots for an hour before planting.`,
		`Anything else before ${roseDay}? Otherwise, talk then.`
	];
	let replyIndex = 0;
	let draft = $state('');
	let nellTyping = $state(false);
	let clock = 23;

	function sendReply(event: SubmitEvent) {
		event.preventDefault();
		const text = draft.trim();
		if (!text || nellTyping) return;
		thread.push({ id: nextId++, from: 'hal', time: at(clock++), text });
		draft = '';
		nellTyping = true;
		later(1600, () => {
			thread.push({ id: nextId++, from: 'nell', time: at(clock++), text: replies[replyIndex % replies.length] });
			replyIndex++;
			nellTyping = false;
		});
	}

	/* ---------------------------------------------------------------- Bubble */
	let liked = $state(false);
	let resend = $state<'failed' | 'sending' | 'sent'>('failed');
	function retrySend() {
		if (resend !== 'failed') return;
		resend = 'sending';
		later(1200, () => (resend = 'sent'));
	}

	/* ------------------------------------------------------------ Attachment */
	type FileRow = {
		id: string;
		name: string;
		detail: string;
		kind: 'pdf' | 'sheet' | 'image';
		state: 'done' | 'uploading' | 'error';
	};
	const startingFiles: FileRow[] = [
		{ id: 'invoice', name: 'invoice-4471.pdf', detail: 'PDF, 84 KB', kind: 'pdf', state: 'done' },
		{ id: 'guide', name: 'planting-bare-root-roses.pdf', detail: 'PDF, 1.2 MB', kind: 'pdf', state: 'done' },
		{ id: 'photo', name: 'rose-bed-under-leaves.jpg', detail: 'Uploading, 3.1 of 4.8 MB', kind: 'image', state: 'uploading' },
		{ id: 'soil', name: 'soil-test-results.xlsx', detail: 'Over the 10 MB limit', kind: 'sheet', state: 'error' }
	];
	let files = $state<FileRow[]>(startingFiles.map((f) => ({ ...f })));
	let opened = $state<string | null>(null);
	function removeFile(id: string) {
		files = files.filter((f) => f.id !== id);
		if (opened === id) opened = null;
	}
	function retryFile(id: string) {
		const file = files.find((f) => f.id === id);
		if (!file) return;
		file.state = 'uploading';
		file.detail = 'Uploading, 0.4 of 2.6 MB';
		later(1400, () => {
			const f = files.find((x) => x.id === id);
			if (f) {
				f.state = 'done';
				f.detail = 'XLSX, 2.6 MB';
			}
		});
	}

	const photos = [
		{ name: 'ferry-lane-rose-bed.jpg', size: '2.4 MB' },
		{ name: 'bed-under-cardboard.jpg', size: '3.7 MB' },
		{ name: 'bed-marked-out.heic', size: '1.9 MB' }
	];

	/* ------------------------------------------------------------ Code block */
	const svelteCode = `<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let held = $state(false);
<\/script>

<!-- Keep a pre-order in the cold store until the ground thaws. -->
<Button variant="outline" disabled={held} onclick={() => (held = true)}>
	{held ? 'Held in the cold store' : 'Hold my order'}
</Button>`;

	const bashCode = `# Add the button, then start the dev server
npx shadcn-svelte@latest add button
npm run dev -- --open`;

	/* Nell adds a note to Marguerite's order before Priya leaves. */
	const sideGate = order('#4474');
	const field = (key: string, value: unknown, last = false) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}${last ? '' : ','}`;
	const diffLines: { text: string; variant?: 'added' | 'removed' }[] = [
		{ text: '{' },
		{ text: field('order', sideGate.id) },
		{ text: field('customer', sideGate.customer.name) },
		{ text: field('status', sideGate.status) },
		{ text: field('due', sideGate.due) },
		{ text: field('slot', slotWindow(sideGate.slot)) },
		{ text: field('van', sideGate.van) },
		{ text: field('note', null, true), variant: 'removed' },
		{ text: field('note', sideGate.note, true), variant: 'added' },
		{ text: '}' }
	];
	const diffCode = diffLines.map((l) => l.text).join('\n');

	const svelteLines = useHighlightedCode(
		() => svelteCode,
		() => 'svelte'
	);
	const bashLines = useHighlightedCode(
		() => bashCode,
		() => 'bash'
	);
	const diffHighlighted = useHighlightedCode(
		() => diffCode,
		() => 'json'
	);

	/* ---------------------------------------------------------------- Marker */
	let showEarlier = $state(false);

	/* ----------------------------------------------------------------- Trace */
	type StepState = 'pending' | 'running' | 'done';
	type StepId = 'lookup' | 'stock' | 'draft';
	const steps: { id: StepId; label: Record<StepState, string>; took: string }[] = [
		{
			id: 'lookup',
			label: { pending: 'Look up order #4471', running: 'Looking up order #4471', done: 'Looked up order #4471' },
			took: '0.8s'
		},
		{
			id: 'stock',
			label: { pending: 'Check stock', running: 'Checking stock', done: 'Checked stock' },
			took: '1.3s'
		},
		{
			id: 'draft',
			label: { pending: 'Draft reply', running: 'Drafting reply', done: 'Drafted reply' },
			took: '2.1s'
		}
	];
	let stepState = $state<Record<StepId, StepState>>({ lookup: 'done', stock: 'done', draft: 'done' });
	let traceOpen = $state<Record<StepId, boolean>>({ lookup: false, stock: true, draft: false });
	const running = $derived(Object.values(stepState).some((s) => s !== 'done'));

	function runTrace() {
		if (running) return;
		stepState = { lookup: 'running', stock: 'pending', draft: 'pending' };
		later(900, () => {
			stepState.lookup = 'done';
			stepState.stock = 'running';
		});
		later(2200, () => {
			stepState.stock = 'done';
			stepState.draft = 'running';
		});
		later(3900, () => (stepState.draft = 'done'));
	}

	const orderJson = JSON.stringify(
		{
			order: roses.id,
			customer: roses.customer.name,
			address: roses.customer.street,
			items: roses.lines.map((l) => `${l.qty} × ${l.plant.name}`),
			status: roses.status,
			due: roses.due,
			slot: roseWindow,
			van: roses.van,
			delivery: orderDeliveryFee(roses),
			total: orderTotal(roses)
		},
		null,
		2
	);
	const orderLines = useHighlightedCode(
		() => orderJson,
		() => 'json'
	);

	let stockCheck = $state<'error' | 'running' | 'done'>('error');
	function retryStock() {
		stockCheck = 'running';
		later(1300, () => (stockCheck = 'done'));
	}

	/* --------------------------------------------------------- Questionnaire */
	/* The three van runs after Saturday. */
	const runDays = ['2026-10-27', '2026-10-29', '2026-10-31'].map((date) => ({
		value: date,
		label: formatLongDate(date),
		booked: orders.filter((o) => o.due === date && o.van === 'Van 1').length
	}));
	const deliveryItems = [
		{ name: 'day', required: true, choices: runDays.map((d) => ({ value: d.value })) },
		{ name: 'slot', required: true, choices: delivery.slots.map((s) => ({ value: s.id })) },
		{ name: 'notes', choices: [{ value: 'shed' }, { value: 'call' }, { value: 'compost' }] }
	];

	const noteLabels: Record<string, string> = {
		shed: 'Leave it by the shed',
		call: 'Call 20 minutes before',
		compost: `Add a bag of compost (${formatMoney(plants.compost.price)})`
	};

	let booking = $state<{ day: string; notes: string[] } | null>(null);

	function book(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		const day = String(data.get('day') ?? '');
		const slot = delivery.slots.find((s) => s.id === data.get('slot'));
		const dayLabel = runDays.find((d) => d.value === day)?.label ?? day;
		booking = {
			day: slot ? `${dayLabel}, ${slot.window}` : dayLabel,
			notes: data.getAll('notes').map((n) => noteLabels[String(n)] ?? String(n))
		};
	}
</script>

{#snippet hal(size: 'default' | 'sm' = 'default')}
	<Avatar.Root {size}>
		<Avatar.Fallback>{halJennings.initials}</Avatar.Fallback>
	</Avatar.Root>
{/snippet}

{#snippet nell(size: 'default' | 'sm' = 'default')}
	<Avatar.Root {size}>
		<Avatar.Fallback class="bg-accent text-accent-foreground">{nellOkafor.initials}</Avatar.Fallback>
	</Avatar.Root>
{/snippet}

{#snippet stepIcon(state: StepState | 'error')}
	<Trace.Icon>
		{#if state === 'running'}
			<LoaderCircleIcon class="animate-spin" />
		{:else if state === 'pending'}
			<CircleDashedIcon />
		{:else if state === 'error'}
			<CircleAlertIcon />
		{:else}
			<CircleCheckIcon />
		{/if}
	</Trace.Icon>
{/snippet}

<CatalogPage group="conversation" {sections}>
	<!-- Message -->
	<Section
		id="message"
		title="Message"
		description="One turn in a conversation: the avatar, the sender, the words and a status line."
	>
		<Demo label="Support thread" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-6">
				<Marker.Root variant="separator">
					<Marker.Content>{todayLong}</Marker.Content>
				</Marker.Root>

				<Message.Root align="end">
					<Message.Avatar>{@render hal()}</Message.Avatar>
					<Message.Content>
						<Message.Header>{halJennings.name}</Message.Header>
						<Bubble.Root>
							<Bubble.Content>
								Hi, I have three bare-root roses on order, {roses.id}. There's a frost warning for
								tonight. Will that hold them up?
							</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>

				<Message.Group>
					<Message.Root>
						<Message.Avatar />
						<Message.Content>
							<Message.Header>
								{nellOkafor.name}
								<span class="font-sans text-xs font-normal opacity-70">{shop.name}, {at(21)}</span>
							</Message.Header>
							<Bubble.Root variant="ghost">
								<Bubble.Content>
									No. They're still dormant at the grower and land here on {roseArrives}.
								</Bubble.Content>
							</Bubble.Root>
						</Message.Content>
					</Message.Root>
					<Message.Root>
						<Message.Avatar>{@render nell()}</Message.Avatar>
						<Message.Content>
							<Bubble.Root variant="ghost">
								<Bubble.Content>
									{firstName(priya.name)} brings them on the {roseDay} morning run, {roseWindow}.
									Cover the bed with chopped leaves tonight so it stays workable.
								</Bubble.Content>
							</Bubble.Root>
						</Message.Content>
					</Message.Root>
				</Message.Group>

				<Message.Root align="end">
					<Message.Avatar>{@render hal()}</Message.Avatar>
					<Message.Content>
						<Bubble.Root>
							<Bubble.Content>{roseDay.split(',')[0]} works. Thanks, Nell.</Bubble.Content>
						</Bubble.Root>
						<Message.Footer>Read {at(24)}</Message.Footer>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="On the ink card" tone="ink" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-6">
				<Message.Root align="end">
					<Message.Content>
						<Bubble.Root>
							<Bubble.Content>Can Priya leave them by the shed if I'm out?</Bubble.Content>
						</Bubble.Root>
						<Message.Footer>Delivered</Message.Footer>
					</Message.Content>
				</Message.Root>
				<Message.Root>
					<Message.Avatar>{@render nell()}</Message.Avatar>
					<Message.Content>
						<Message.Header>{nellOkafor.name}</Message.Header>
						<Bubble.Root variant="ghost">
							<Bubble.Content>
								Yes. She'll wrap the roots in damp burlap and text you a photo when they're down.
							</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>
	</Section>

	<!-- Message scroller -->
	<Section
		id="message-scroller"
		title="Message scroller"
		description="Holds a long thread, opens at the latest message and follows new replies while you are at the bottom."
	>
		<Demo label="Send a reply, or scroll up to see the jump button" layout="block">
			<div class="mx-auto flex h-[30rem] max-w-2xl flex-col gap-4">
				<MessageScroller.Provider autoScroll>
					<MessageScroller.Root class="flex-1">
						<MessageScroller.Viewport>
							<MessageScroller.Content class="gap-5 pe-2 pb-6" aria-busy={nellTyping}>
								<MessageScroller.Item>
									<Marker.Root variant="separator">
										<Marker.Content>{todayLong}</Marker.Content>
									</Marker.Root>
								</MessageScroller.Item>
								{#each thread as line (line.id)}
									<MessageScroller.Item messageId={String(line.id)} scrollAnchor={line.from === 'hal'}>
										{#if line.from === 'hal'}
											<Message.Root align="end">
												<Message.Content>
													<Bubble.Root>
														<Bubble.Content>{line.text}</Bubble.Content>
													</Bubble.Root>
													<Message.Footer>{line.time}</Message.Footer>
												</Message.Content>
											</Message.Root>
										{:else}
											<Message.Root>
												<Message.Avatar>{@render nell('sm')}</Message.Avatar>
												<Message.Content>
													<Bubble.Root variant="ghost">
														<Bubble.Content>{line.text}</Bubble.Content>
													</Bubble.Root>
													<Message.Footer>Nell, {line.time}</Message.Footer>
												</Message.Content>
											</Message.Root>
										{/if}
									</MessageScroller.Item>
								{/each}
								{#if nellTyping}
									<MessageScroller.Item>
										<Marker.Root role="status">
											<Marker.Icon><Spinner aria-hidden="true" /></Marker.Icon>
											<Marker.Content>Nell is typing…</Marker.Content>
										</Marker.Root>
									</MessageScroller.Item>
								{/if}
							</MessageScroller.Content>
						</MessageScroller.Viewport>
						<MessageScroller.Button />
					</MessageScroller.Root>
				</MessageScroller.Provider>
				<form class="flex gap-2 border-t pt-4" onsubmit={sendReply}>
					<Input bind:value={draft} aria-label="Reply to Nell" placeholder="Write to Nell" autocomplete="off" />
					<Button type="submit" disabled={!draft.trim() || nellTyping}>Send</Button>
				</form>
			</div>
		</Demo>
	</Section>

	<!-- Bubble -->
	<Section
		id="bubble"
		title="Bubble"
		description="The surface of a message. Warm for the person writing, plain text for the reply."
	>
		<Demo label="Variants" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-3">
				<Bubble.Root align="end">
					<Bubble.Content>Default: the warm tint, for the person writing.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="ghost">
					<Bubble.Content>
						Ghost: plain text on the page, for the reply. It can run the full width of the thread,
						which suits longer answers about pruning and planting depth.
					</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="tinted">
					<Bubble.Content>Tinted: the cool tint, for a note from the system.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="muted">
					<Bubble.Content>Muted: deeper paper, for quoted or quiet content.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="outline">
					<Bubble.Content>Outline: a hairline, for suggestions.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="destructive" align="end">
					<Bubble.Content>Destructive: for a message that failed.</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>

		<Demo label="Reaction and retry" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-6">
				<Bubble.Root variant="ghost">
					<Bubble.Content>
						Your foxgloves and lavender, {foxgloves.id}, go out on the
						{formatLongDate(foxgloves.due!)} afternoon run, {slotWindow(foxgloves.slot)}.
					</Bubble.Content>
					<Bubble.Reactions align="start">
						<Button
							variant="ghost"
							size="xs"
							aria-pressed={liked}
							aria-label={liked ? 'Remove your thumbs up' : 'Give a thumbs up'}
							onclick={() => (liked = !liked)}
						>
							<ThumbsUpIcon data-icon="inline-start" class={liked ? 'fill-current' : ''} />
							<span class="tabular-nums">{liked ? 2 : 1}</span>
						</Button>
					</Bubble.Reactions>
				</Bubble.Root>

				<Message.Root align="end">
					<Message.Content>
						<Bubble.Root variant={resend === 'sent' ? 'default' : 'destructive'}>
							<Bubble.Content>
								{#snippet child({ props })}
									<button {...props} onclick={retrySend} aria-disabled={resend !== 'failed'}>
										Please add a bag of compost to the order.
									</button>
								{/snippet}
							</Bubble.Content>
						</Bubble.Root>
						<Message.Footer>
							{#if resend === 'failed'}
								<span class="font-medium text-destructive">Not sent. Tap the message to retry.</span>
							{:else if resend === 'sending'}
								Sending…
							{:else}
								Delivered {at(31)}
							{/if}
						</Message.Footer>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="On the ink card" tone="ink" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-3">
				<Bubble.Root align="end">
					<Bubble.Content>How deep should the graft union sit?</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="ghost">
					<Bubble.Content>About 2 inches below the soil. It protects the union from frost.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="outline">
					<Bubble.Content>Show me a planting diagram</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>
	</Section>

	<!-- Attachment -->
	<Section
		id="attachment"
		title="Attachment"
		description="A file sent in a conversation, with its name, size, upload state and actions."
	>
		<Demo label="Files" layout="stack">
			{#if files.length}
				<div class="flex flex-wrap gap-3">
					{#each files as file (file.id)}
						<Attachment.Root state={file.state} class="max-w-80">
							{#if file.state === 'done'}
								<Attachment.Trigger
									aria-label="Open {file.name}"
									aria-pressed={opened === file.id}
									onclick={() => (opened = opened === file.id ? null : file.id)}
								/>
							{/if}
							<Attachment.Media>
								{#if file.state === 'uploading'}
									<Spinner aria-label="Uploading" />
								{:else if file.state === 'error'}
									<CircleAlertIcon />
								{:else if file.kind === 'sheet'}
									<FileSpreadsheetIcon />
								{:else if file.kind === 'image'}
									<ImageIcon />
								{:else}
									<FileTextIcon />
								{/if}
							</Attachment.Media>
							<Attachment.Content>
								<Attachment.Title>{file.name}</Attachment.Title>
								<Attachment.Description>{file.detail}</Attachment.Description>
							</Attachment.Content>
							<Attachment.Actions>
								{#if file.state === 'error'}
									<Attachment.Action aria-label="Retry {file.name}" onclick={() => retryFile(file.id)}>
										<RotateCwIcon />
									</Attachment.Action>
								{:else if file.state === 'done'}
									<Attachment.Action aria-label="Download {file.name}">
										<DownloadIcon />
									</Attachment.Action>
								{/if}
								<Attachment.Action aria-label="Remove {file.name}" onclick={() => removeFile(file.id)}>
									<XIcon />
								</Attachment.Action>
							</Attachment.Actions>
						</Attachment.Root>
					{/each}
				</div>
				<p class="text-sm text-muted-foreground" aria-live="polite">
					{#if opened}
						Opened {files.find((f) => f.id === opened)?.name}.
					{:else}
						Select a finished file to open it.
					{/if}
				</p>
			{:else}
				<div class="flex flex-wrap items-center gap-4">
					<p class="text-[0.9375rem]">No files on this order. Attach the invoice or a photo of the bed.</p>
					<Button
						variant="outline"
						size="sm"
						onclick={() => (files = startingFiles.map((f) => ({ ...f })))}
					>
						Put the files back
					</Button>
				</div>
			{/if}
		</Demo>

		<Demo label="Photos, on the cool block" tone="cool">
			{#each photos as photo, i (photo.name)}
				<Attachment.Root orientation="vertical" state={i === 2 ? 'processing' : 'done'}>
					<Attachment.Media variant="image">
						<ImageIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>{photo.name}</Attachment.Title>
						<Attachment.Description>{i === 2 ? 'Converting' : photo.size}</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
			{/each}
			<Attachment.Root size="sm">
				<Attachment.Media>
					<FileTextIcon />
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>receipt-{foxgloves.id.slice(1)}.pdf</Attachment.Title>
					<Attachment.Description>PDF, 61 KB</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
		</Demo>
	</Section>

	<!-- Code block -->
	<Section
		id="code-block"
		title="Code block"
		description="Code, terminal commands and diffs, with the file name and a copy button."
	>
		<Demo label="Svelte, with line numbers" layout="block">
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title>src/routes/order/+page.svelte</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={svelteCode} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content lineNumbers>
					{#each svelteLines.current as line, index (index)}
						<CodeBlock.Line code={line} />
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>
		</Demo>

		<Demo label="Terminal, on the ink card" tone="ink" layout="block">
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title>bash</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={bashCode} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content>
					{#each bashLines.current as line, index (index)}
						<CodeBlock.Line code={line} />
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>
		</Demo>

		<Demo label="Diff, small size with floating copy" tone="warm" layout="block">
			<CodeBlock.Root size="sm">
				<CodeBlock.Actions>
					<CodeBlock.CopyButton value={diffCode} />
				</CodeBlock.Actions>
				<CodeBlock.Content>
					{#each diffHighlighted.current as line, index (index)}
						<CodeBlock.Line code={line} variant={diffLines[index]?.variant} />
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>
		</Demo>
	</Section>

	<!-- Marker -->
	<Section
		id="marker"
		title="Marker"
		description="A small note between messages: a date, a status, someone joining."
	>
		<Demo label="In a thread" layout="block">
			<div class="mx-auto flex max-w-2xl flex-col gap-5">
				<Marker.Root>
					{#snippet child({ props })}
						<button {...props} aria-expanded={showEarlier} onclick={() => (showEarlier = !showEarlier)}>
							<Marker.Content>
								{showEarlier ? 'Hide 4 earlier messages' : 'Show 4 earlier messages'}
							</Marker.Content>
						</button>
					{/snippet}
				</Marker.Root>
				{#if showEarlier}
					<p class="text-[0.9375rem] text-muted-foreground">
						{formatLongDate(roses.placed)}: Hal pre-ordered three bare-root roses, {roses.id}, for
						{roseTotal} with free delivery.
					</p>
				{/if}
				<Marker.Root variant="separator">
					<Marker.Content>{todayLong}</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="border">
					<Marker.Content>{priya.name} joined the conversation</Marker.Content>
				</Marker.Root>
				<Marker.Root>
					<Marker.Icon><TruckIcon /></Marker.Icon>
					<Marker.Content>
						Order {foxgloves.id} moved to {formatLongDate(foxgloves.due!)}, afternoon
					</Marker.Content>
				</Marker.Root>
				<Marker.Root role="status">
					<Marker.Icon><Spinner aria-hidden="true" /></Marker.Icon>
					<Marker.Content>Priya is typing…</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="On the warm block" tone="warm" layout="stack">
			<Marker.Root variant="separator">
				<Marker.Content>{formatLongDate(foxgloves.due!)}</Marker.Content>
			</Marker.Root>
			<Marker.Root>
				<Marker.Icon><CheckIcon /></Marker.Icon>
				<Marker.Content>Delivered to the shed at {formatTime(`${foxgloves.due}T14:42:00`)}</Marker.Content>
			</Marker.Root>
		</Demo>
	</Section>

	<!-- Trace -->
	<Section
		id="trace"
		title="Trace"
		description="The steps an assistant took before it replied, each one open for detail."
	>
		<Demo label="Tool steps" layout="stack">
			<Trace.Root>
				{#each steps as step (step.id)}
					{@const state = stepState[step.id]}
					<Trace.Collapsible
						open={state === 'done' && traceOpen[step.id]}
						onOpenChange={(open) => (traceOpen[step.id] = open)}
						disabled={state !== 'done'}
					>
						<Trace.CollapsibleTrigger>
							<Trace.Line status={state === 'done' ? undefined : state}>
								{@render stepIcon(state)}
								<Trace.Title>{step.label[state]}</Trace.Title>
								<Trace.Description>
									{state === 'done' ? `Done, ${step.took}` : state === 'running' ? 'Running' : 'Waiting'}
								</Trace.Description>
							</Trace.Line>
						</Trace.CollapsibleTrigger>
						<Trace.CollapsibleContent>
							{#if step.id === 'lookup'}
								<CodeBlock.Root size="sm">
									<CodeBlock.Content wrap class="max-h-64">
										{#each orderLines.current as line, index (index)}
											<CodeBlock.Line code={line} />
										{/each}
									</CodeBlock.Content>
								</CodeBlock.Root>
							{:else if step.id === 'stock'}
								<Trace.Root>
									<Trace.Line>
										<Trace.Icon><CheckIcon /></Trace.Icon>
										<Trace.Title>{rose.name}</Trace.Title>
										<Trace.Description>
											{stockState(rose)}: {rose.stock} in stock, {rose.reserved} reserved
										</Trace.Description>
									</Trace.Line>
									<Trace.Line>
										<Trace.Icon><CheckIcon /></Trace.Icon>
										<Trace.Title>Arrives at the nursery</Trace.Title>
										<Trace.Description>{roseArrives}</Trace.Description>
									</Trace.Line>
									<Trace.Line>
										<Trace.Icon><TruckIcon /></Trace.Icon>
										<Trace.Title>First run after</Trace.Title>
										<Trace.Description>{roseDay}, {roses.van}</Trace.Description>
									</Trace.Line>
								</Trace.Root>
							{:else}
								<p>
									Hi Hal, your three roses land here on {roseArrives}, and Priya brings them on
									{roseDay} between {roseWindow.replace(' to ', ' and ')}. The total is {roseTotal}
									with free delivery. Frost is forecast tonight, down to {weather.frostLow}, so cover the
									bed with chopped leaves to keep it workable.
								</p>
							{/if}
						</Trace.CollapsibleContent>
					</Trace.Collapsible>
				{/each}
			</Trace.Root>
			<div>
				<Button variant="outline" size="sm" onclick={runTrace} disabled={running}>
					{running ? 'Running…' : 'Run again'}
				</Button>
			</div>
		</Demo>

		<Demo label="A failed step, on the warm block" tone="warm" layout="stack">
			<Trace.Root>
				<Trace.Line>
					{@render stepIcon('done')}
					<Trace.Title>Looked up order #4479</Trace.Title>
					<Trace.Description>Done, 0.6s</Trace.Description>
				</Trace.Line>
				<Trace.Line status={stockCheck === 'done' ? undefined : stockCheck}>
					{@render stepIcon(stockCheck)}
					<Trace.Title>
						{stockCheck === 'error'
							? 'Could not check stock'
							: stockCheck === 'running'
								? 'Checking stock'
								: 'Checked stock'}
					</Trace.Title>
					<Trace.Description>
						{stockCheck === 'error'
							? 'Failed, no answer after 8.2s'
							: stockCheck === 'running'
								? 'Running'
								: 'Done, 1.1s'}
					</Trace.Description>
				</Trace.Line>
			</Trace.Root>
			{#if stockCheck === 'error'}
				<div>
					<Button variant="outline" size="sm" onclick={retryStock}>Try again</Button>
				</div>
			{/if}
		</Demo>
	</Section>

	<!-- Questionnaire -->
	<Section
		id="questionnaire"
		title="Questionnaire"
		description="A few questions asked inside the chat, one at a time, with a progress bar."
	>
		<Demo label="Pick a delivery day" layout="block">
			<div class="mx-auto max-w-xl">
				{#if booking}
					<div class="flex flex-col gap-4" role="status">
						<p class="display-4">Booked for {booking.day}.</p>
						{#if booking.notes.length}
							<ul class="flex flex-col border-t">
								{#each booking.notes as note (note)}
									<li class="border-b py-3 text-[0.9375rem]">{note}</li>
								{/each}
							</ul>
						{:else}
							<p class="text-[0.9375rem] text-muted-foreground">No delivery notes.</p>
						{/if}
						<div>
							<Button variant="outline" size="sm" onclick={() => (booking = null)}>Change answers</Button>
						</div>
					</div>
				{:else}
					<Questionnaire.Root defaultItem="day" items={deliveryItems} shortcuts="numbers" onSubmit={book}>
						<Questionnaire.Progress />
						<Questionnaire.Item name="day" required>
							<Questionnaire.Title>Which day should Priya bring your order?</Questionnaire.Title>
							<Questionnaire.Description>
								The vans go out on {delivery.days.slice(0, -1).join(', ')} and {delivery.days.at(-1)}.
							</Questionnaire.Description>
							<Questionnaire.Choices>
								{#each runDays as day (day.value)}
									<Questionnaire.Choice value={day.value}>
										{day.label}
										<Questionnaire.ChoiceDescription>
											{day.booked === 0
												? 'Nothing booked on Van 1 yet.'
												: `${day.booked} ${day.booked === 1 ? 'stop' : 'stops'} booked on Van 1 so far.`}
										</Questionnaire.ChoiceDescription>
									</Questionnaire.Choice>
								{/each}
								<Questionnaire.Input aria-label="Another day" placeholder="Suggest another day" />
							</Questionnaire.Choices>
							<Questionnaire.Error />
						</Questionnaire.Item>
						<Questionnaire.Item name="slot" required>
							<Questionnaire.Title>Morning or afternoon?</Questionnaire.Title>
							<Questionnaire.Description>Every run has two slots.</Questionnaire.Description>
							<Questionnaire.Choices>
								{#each delivery.slots as slot (slot.id)}
									<Questionnaire.Choice value={slot.id}>
										{slot.label}
										<Questionnaire.ChoiceDescription>{slot.window}</Questionnaire.ChoiceDescription>
									</Questionnaire.Choice>
								{/each}
							</Questionnaire.Choices>
							<Questionnaire.Error />
						</Questionnaire.Item>
						<Questionnaire.Item name="notes" multiple>
							<Questionnaire.Title>Anything Priya should know?</Questionnaire.Title>
							<Questionnaire.Description>Pick any that apply, or skip.</Questionnaire.Description>
							<Questionnaire.Choices>
								{#each Object.entries(noteLabels) as [value, label] (value)}
									<Questionnaire.Choice {value}>{label}</Questionnaire.Choice>
								{/each}
							</Questionnaire.Choices>
							<Questionnaire.Error />
						</Questionnaire.Item>
						<Questionnaire.Actions>
							<Questionnaire.Previous>Back</Questionnaire.Previous>
							<Questionnaire.Skip>Skip</Questionnaire.Skip>
							<Questionnaire.Next>Next</Questionnaire.Next>
							<Questionnaire.Submit>Book delivery</Questionnaire.Submit>
						</Questionnaire.Actions>
					</Questionnaire.Root>
				{/if}
			</div>
		</Demo>
	</Section>
</CatalogPage>
