<script lang="ts">
	import { PageIntro, Section, Demo } from '#lib/components/showcase/index.js';
	import { StylesBlock, PaletteRow, MotionDemo } from '#lib/components/styles/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Typography from '#lib/components/ui/typography/index.js';
	import { palettes } from '#lib/theme/palettes.js';
	import {
		delivery,
		formatLongDate,
		formatMoney,
		order,
		orderSummary,
		orderTotal,
		plants,
		shop,
		stockTake
	} from '#lib/demos/world.js';

	/** "Tuesday, Thursday and Saturday" */
	const listJoin = (items: readonly string[]) =>
		items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

	const hellebore = plants.hellebore;
	const rose = plants.rose;
	const roseArrives = formatLongDate(rose.arrives);
	const order4479 = order('#4479');
	const order4471 = order('#4471');
	const taxRate = `${+(shop.taxRate * 100).toFixed(2)}%`;

	const sections = [
		{ id: 'palettes', title: 'Palettes' },
		{ id: 'semantic-roles', title: 'Semantic roles' },
		{ id: 'surfaces', title: 'Surfaces' },
		{ id: 'type', title: 'Type' },
		{ id: 'radius-and-rhythm', title: 'Radius and rhythm' },
		{ id: 'hairlines-and-blocks', title: 'Hairlines and blocks' },
		{ id: 'motion', title: 'Motion' },
		{ id: 'typography', title: 'Typography' }
	];

	// Swatch classes are written out in full so Tailwind finds them.
	const roles = [
		{ token: 'background', swatch: 'bg-background', use: 'The page, cards and floating layers.' },
		{ token: 'foreground', swatch: 'bg-foreground', use: 'Body text and headings.' },
		{ token: 'primary', swatch: 'bg-primary', use: 'Primary buttons, the ink card, checked controls.' },
		{ token: 'primary-foreground', swatch: 'bg-primary-foreground', use: 'Text and icons on primary.' },
		{ token: 'secondary', swatch: 'bg-secondary', use: 'The warm block: page intros and secondary buttons.' },
		{ token: 'accent', swatch: 'bg-accent', use: 'The cool block, and text selection.' },
		{ token: 'muted', swatch: 'bg-muted', use: 'Quiet fills: hovered rows, skeletons, empty tracks.' },
		{
			token: 'muted-foreground',
			swatch: 'bg-muted-foreground',
			use: 'Secondary text: descriptions, captions, table heads.'
		},
		{
			token: 'border',
			swatch: 'bg-border',
			use: 'Hairlines and input outlines. Input and ring use the same value.'
		},
		{
			token: 'destructive',
			swatch: 'bg-destructive',
			use: 'Errors and actions that delete. The one colour outside the palette.'
		},
		{ token: 'overlay', swatch: 'bg-overlay', use: 'The scrim behind dialogs, sheets and drawers.' },
		{ token: 'chart-1', swatch: 'bg-chart-1', use: 'The series the chart is about.' },
		{ token: 'chart-2', swatch: 'bg-chart-2', use: 'Second series, usually the comparison.' },
		{ token: 'chart-3', swatch: 'bg-chart-3', use: 'Third series.' },
		{ token: 'chart-4', swatch: 'bg-chart-4', use: 'Fourth series.' },
		{ token: 'chart-5', swatch: 'bg-chart-5', use: 'Fifth series, or the empty part of a track.' },
		{
			token: 'sidebar',
			swatch: 'bg-sidebar',
			use: 'The sidebar, with its own foreground, primary, accent and border.'
		}
	];

	const surfaces = [
		{ tone: 'paper', label: 'Paper with a hairline' },
		{ tone: 'warm', label: 'Warm block' },
		{ tone: 'cool', label: 'Cool block' },
		{ tone: 'ink', label: 'Ink card' }
	] as const;

	const display = [
		{
			name: 'display-1',
			meta: 'Manrope 800 · 60px, 104px from md · line 0.95 · tracking -0.04em',
			use: 'Once per page, on the landing hero.',
			sample: 'Frost tonight'
		},
		{
			name: 'display-2',
			meta: 'Manrope 800 · 38px, 56px from md · line 1 · tracking -0.04em',
			use: 'Page titles and section titles.',
			sample: 'Rose pre-orders are open'
		},
		{
			name: 'display-3',
			meta: 'Manrope 800 · 26px · line 1.1 · tracking -0.03em',
			use: 'Card, dialog and component titles.',
			sample: hellebore.name
		},
		{
			name: 'display-4',
			meta: 'Manrope 800 · 20px · line 1.25 · tracking -0.02em',
			use: 'Small titles inside blocks.',
			sample: `Delivery on ${formatLongDate(order4479.due!)}`
		},
		{
			name: 'row-title',
			meta: 'Manrope 800 · 18px, 30px from md · line 1.25 · tracking -0.02em, -0.03em from md',
			use: 'The title of a row in a hairline list.',
			sample: `Order ${order4471.id}, ${order4471.customer.name}`
		},
		{
			name: 'lead',
			meta: 'DM Sans 400 · 16px, 18px from md · line 1.5',
			use: 'The first paragraph under a page or section title.',
			sample:
				'We grow most of what we sell in two polytunnels behind the shop, a short walk from the river.'
		},
		{
			name: 'figure',
			meta: 'Manrope 800 · 40px, 48px from md · line 1 · tracking -0.04em',
			use: 'Prices and the one number a block is about.',
			sample: formatMoney(orderTotal(order4479))
		}
	] as const;

	const body = [
		{
			name: 'text-base',
			meta: 'DM Sans 400 · 16px · line 1.5',
			use: 'Body text.',
			className: 'text-base',
			sample: `Witch hazel: ${plants.witchHazel.care}`
		},
		{
			name: 'text-[0.9375rem]',
			meta: 'DM Sans 400 · 15px · line 1.5',
			use: 'Controls, menu items and table cells.',
			className: 'text-[0.9375rem]',
			sample: `The vans go out on ${listJoin(delivery.days)}.`
		},
		{
			name: 'text-sm',
			meta: 'DM Sans 400 · 14px · line 1.43',
			use: 'Descriptions and captions.',
			className: 'text-sm',
			sample: 'Bronze fennel seeds itself everywhere. Cut the heads off in August if you want fewer.'
		},
		{
			name: 'text-xs',
			meta: 'DM Sans 400 · 12px · line 1.33',
			use: 'Fine print and meta.',
			className: 'text-xs',
			sample: `Prices exclude ${taxRate} sales tax, added at the till. Stock counted ${formatLongDate(stockTake.date)}.`
		}
	] as const;

	const radii = [
		{ name: 'rounded-xs', px: '6px', className: 'rounded-xs', use: 'Checkbox, kbd, inline code' },
		{ name: 'rounded-sm', px: '8px', className: 'rounded-sm', use: 'Small chips and swatches' },
		{ name: 'rounded-md', px: '12px', className: 'rounded-md', use: 'Menu items, tabs, tooltips' },
		{ name: 'rounded-lg', px: '20px', className: 'rounded-lg', use: 'Cards, popovers, dialogs' },
		{
			name: 'rounded-xl, rounded-block',
			px: '28px',
			className: 'rounded-block',
			use: 'Colour blocks and the ink card'
		},
		{ name: 'rounded-full', px: '999px', className: 'rounded-full', use: 'Buttons, inputs, badges' }
	];

	const rhythm = [
		{
			name: 'Gutter',
			utility: 'wrap',
			value: '20px on phones, 64px from md. Content stops at 1440px.'
		},
		{
			name: 'Section gap',
			utility: 'section-gap',
			value: '64px on phones, 112px from md, between bands.'
		},
		{
			name: 'Inside a page',
			utility: 'py-8 md:py-12',
			value: '32px, then 48px from md, above and below each hairline section.'
		}
	];

	const orders = ['#4471', '#4478', '#4479', '#4480'].map((id) => {
		const o = order(id);
		return { id, name: o.customer.name, items: orderSummary(o), total: formatMoney(orderTotal(o)) };
	});

	const motion = [
		{
			value: '150ms, ease-out',
			use: 'Routine state changes: hover tints, toggles, checks, row selection.'
		},
		{
			value: '200-300ms',
			use: 'Overlays: dialogs, sheets, popovers and menus. Ease-out in, ease-in out. They enter from 95% scale and transparent, never from zero.'
		},
		{
			value: 'Named properties',
			use: 'transition-[background-color,color] or transition-opacity. Never transition-all or a bare transition.'
		},
		{
			value: 'Reduced motion',
			use: 'The base layer cuts every animation and transition to near zero when the system asks for it.'
		},
		{ value: 'Not used', use: 'Lifts on hover, count-ups, looping decoration, entrances on scroll.' }
	];
</script>

<svelte:head>
	<title>Styles · Meadow</title>
	<meta
		name="description"
		content="The tokens under every Meadow component: four palettes, two typefaces, a radius scale, hairlines and motion."
	/>
</svelte:head>

<PageIntro
	title="Styles"
	lead="The tokens under every component: four palettes, two typefaces, a radius scale, hairlines and two motion speeds, all in one layout.css you can copy."
>
	<nav aria-label="On this page" class="mt-8 md:mt-10">
		<ul class="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
			{#each sections as { id, title } (id)}
				<li>
					<a
						href="#{id}"
						class="rounded-xs decoration-2 underline-offset-[5px] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
					>
						{title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</PageIntro>

<div class="wrap mt-6 md:mt-10">
	<StylesBlock
		id="palettes"
		title="Palettes"
		description="Each palette is five colours: paper, a warm tint, a cool tint, one ink and a softer ink for secondary text. These are the light values. Dark mode turns them around: the ink becomes the page and the warm tint becomes the primary colour."
	>
		<div class="border-t">
			{#each palettes as palette (palette.id)}
				<PaletteRow {palette} />
			{/each}
		</div>
	</StylesBlock>

	<Section
		id="semantic-roles"
		title="Semantic roles"
		description="Components only use these names. The swatches follow the palette and mode you have on now."
	>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-16">Swatch</Table.Head>
					<Table.Head>Token</Table.Head>
					<Table.Head class="max-sm:hidden">Used for</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each roles as role (role.token)}
					<Table.Row>
						<Table.Cell>
							<span class="block h-8 w-12 rounded-sm border {role.swatch}"></span>
						</Table.Cell>
						<Table.Cell class="max-sm:py-3 max-sm:whitespace-normal">
							<code class="block text-sm">--{role.token}</code>
							<code class="block text-xs text-muted-foreground">{role.swatch}</code>
							<span class="mt-1 block text-sm leading-normal sm:hidden">{role.use}</span>
						</Table.Cell>
						<Table.Cell class="min-w-[14rem] text-sm leading-normal whitespace-normal max-sm:hidden">
							{role.use}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Section>

	<StylesBlock
		id="surfaces"
		title="Surfaces"
		description="Four surfaces, and every component sits on all of them. Outline and ghost treatments use the current text colour, so they turn over with the surface. On the ink card the main button switches to secondary."
	>
		<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
			{#each surfaces as { tone, label } (tone)}
				<Demo {label} {tone} layout="block" class="flex h-full flex-col">
					<h3 class="display-3">{hellebore.name}</h3>
					<p class="mt-3 mb-6 text-sm leading-normal">
						{hellebore.stock} pots in the {hellebore.location.toLowerCase()}, in bud and flowering
						from December. {formatMoney(hellebore.price)} each.
					</p>
					<div class="mt-auto flex flex-wrap gap-3">
						<Button variant={tone === 'ink' ? 'secondary' : 'default'}>Add to order</Button>
						<Button variant="outline">Save for later</Button>
					</div>
				</Demo>
			{/each}
		</div>
	</StylesBlock>

	<StylesBlock
		id="type"
		title="Type"
		description="Manrope for headings, labels and big numbers; DM Sans for reading. Sentence case everywhere, and tight tracking only on display sizes."
	>
		<ul class="border-t">
			{#each display as row (row.name)}
				<li
					class="grid gap-3 border-b py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] md:gap-10 md:py-8"
				>
					<div class="flex flex-col gap-1">
						<code class="font-display text-sm font-bold">.{row.name}</code>
						<p class="text-xs leading-normal text-muted-foreground">{row.meta}</p>
						<p class="text-xs leading-normal text-muted-foreground">{row.use}</p>
					</div>
					<p class="min-w-0 break-words {row.name}">{row.sample}</p>
				</li>
			{/each}
			{#each body as row (row.name)}
				<li class="grid gap-3 border-b py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] md:gap-10">
					<div class="flex flex-col gap-1">
						<code class="font-display text-sm font-bold">{row.name}</code>
						<p class="text-xs leading-normal text-muted-foreground">{row.meta}</p>
						<p class="text-xs leading-normal text-muted-foreground">{row.use}</p>
					</div>
					<p class="max-w-[38rem] {row.className}">{row.sample}</p>
				</li>
			{/each}
		</ul>

		<div class="mt-8 grid gap-5 md:mt-12 md:grid-cols-2">
			<div class="flex min-w-0 flex-col rounded-block bg-secondary p-6 text-secondary-foreground md:p-10">
				<h3 class="display-3">Manrope Variable</h3>
				<p class="mt-2 max-w-[30rem] text-sm leading-normal">
					800 for headings and figures, 700 for buttons, labels and links. One variable file covers
					both.
				</p>
				<p
					class="mt-8 font-display text-[5.5rem] leading-none font-extrabold tracking-[-0.04em] md:text-[7.5rem]"
					aria-hidden="true"
				>
					Ag
				</p>
				<p class="mt-6 font-display text-lg leading-snug font-extrabold tracking-[-0.02em]">
					800 · Foxglove, sea holly and bronze fennel
				</p>
				<p class="mt-2 font-display text-lg leading-snug font-bold">
					700 · ABCDEFGHIJKLM nopqrstuvwxyz 0123456789
				</p>
			</div>
			<div class="flex min-w-0 flex-col rounded-block bg-accent p-6 text-accent-foreground md:p-10">
				<h3 class="display-3">DM Sans Variable</h3>
				<p class="mt-2 max-w-[30rem] text-sm leading-normal">
					400 for running text, 500 for small labels and anything that needs a little more weight at
					12 or 14px.
				</p>
				<p
					class="mt-8 font-sans text-[5.5rem] leading-none font-normal tracking-[-0.02em] md:text-[7.5rem]"
					aria-hidden="true"
				>
					Ag
				</p>
				<p class="mt-6 text-lg leading-snug font-normal">
					400 · Bare-root roses arrive on {roseArrives}.
				</p>
				<p class="mt-2 text-lg leading-snug font-medium">
					500 · ABCDEFGHIJKLM nopqrstuvwxyz 0123456789
				</p>
			</div>
		</div>
	</StylesBlock>

	<Section
		id="radius-and-rhythm"
		title="Radius and rhythm"
		description="Every radius step has a job. The small steps are fractions of the 20px card radius; colour blocks use their own 28px."
	>
		<Demo label="Radius scale" layout="block">
			<ul class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
				{#each radii as r (r.name)}
					<li class="flex min-w-0 flex-col gap-3">
						<span class="h-20 w-full border bg-accent {r.className}"></span>
						<span class="flex flex-col gap-0.5">
							<code class="font-display text-sm font-bold break-words">{r.name}</code>
							<span class="text-sm tabular-nums">{r.px}</span>
							<span class="text-xs leading-snug text-muted-foreground">{r.use}</span>
						</span>
					</li>
				{/each}
			</ul>
		</Demo>

		<figure class="flex min-w-0 flex-col gap-2">
			<figcaption class="font-display text-[0.8125rem] font-bold">Spacing</figcaption>
			<dl class="border-t">
				{#each rhythm as row (row.name)}
					<div
						class="grid gap-1 border-b py-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-6"
					>
						<dt class="font-display font-bold">{row.name}</dt>
						<dd class="text-[0.9375rem] leading-normal">
							<code class="text-sm">{row.utility}</code>
							<span class="block text-muted-foreground">{row.value}</span>
						</dd>
					</div>
				{/each}
			</dl>
		</figure>

		<Demo label="Control heights" layout="stack">
			<div class="flex flex-wrap items-end gap-x-6 gap-y-4">
				<div class="flex flex-col items-start gap-2">
					<Button size="sm">Reserve</Button>
					<span class="text-xs text-muted-foreground tabular-nums">sm · h-10 · 40px</span>
				</div>
				<div class="flex flex-col items-start gap-2">
					<Button>Reserve</Button>
					<span class="text-xs text-muted-foreground tabular-nums">default · h-12 · 48px</span>
				</div>
				<div class="flex flex-col items-start gap-2">
					<Button size="lg">Reserve</Button>
					<span class="text-xs text-muted-foreground tabular-nums">lg · h-14 · 56px</span>
				</div>
			</div>
			<p class="text-sm leading-normal text-muted-foreground">
				Inputs, selects and toggles use the same three heights, so they line up with buttons in a
				row.
			</p>
		</Demo>
	</Section>

	<Section
		id="hairlines-and-blocks"
		title="Hairlines and blocks"
		description="Lists use hairlines, not cards. A colour block holds the one thing on the page that needs attention."
	>
		<div class="grid gap-8 xl:grid-cols-2 xl:gap-6">
			<figure class="flex min-w-0 flex-col gap-2">
				<figcaption class="font-display text-[0.8125rem] font-bold">
					Hairline list: border-t, then border-b per row
				</figcaption>
				<ul class="border-t">
					{#each orders as order (order.id)}
						<li class="flex items-baseline justify-between gap-4 border-b py-4">
							<span class="min-w-0">
								<span class="row-title block">{order.name}</span>
								<span class="mt-1 block text-sm text-muted-foreground">
									{order.id} · {order.items}
								</span>
							</span>
							<span class="text-[0.9375rem] tabular-nums">{order.total}</span>
						</li>
					{/each}
				</ul>
			</figure>
			<figure class="flex min-w-0 flex-col gap-2">
				<figcaption class="font-display text-[0.8125rem] font-bold">
					Colour block: rounded-block on bg-accent
				</figcaption>
				<div class="flex flex-1 flex-col rounded-block bg-accent p-6 text-accent-foreground md:p-8">
					<h3 class="display-3">Rose pre-orders are open</h3>
					<p class="mt-3 mb-6 max-w-[26rem] text-[0.9375rem] leading-normal">
						{rose.name} arrives on {roseArrives}, at {formatMoney(rose.price)}. So far
						{rose.reserved} are reserved.
					</p>
					<div class="mt-auto">
						<Button>Pre-order a rose</Button>
					</div>
				</div>
			</figure>
		</div>
	</Section>

	<Section
		id="motion"
		title="Motion"
		description="Two speeds. Motion shows that something changed, then stops. Nothing moves on its own."
	>
		<dl class="border-t">
			{#each motion as row (row.value)}
				<div
					class="grid gap-1 border-b py-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-6"
				>
					<dt class="font-display font-bold">{row.value}</dt>
					<dd class="text-[0.9375rem] leading-normal text-muted-foreground">{row.use}</dd>
				</div>
			{/each}
		</dl>
		<figure class="flex min-w-0 flex-col gap-2">
			<figcaption class="font-display text-[0.8125rem] font-bold">
				Both speeds: the row tints in 150ms, the note fades in over the scrim in 200ms
			</figcaption>
			<MotionDemo />
		</figure>
	</Section>

	<Section
		id="typography"
		title="Typography"
		description="Styles for running text: care guides, policies, help pages. Use the components in ui/typography, or put typographyVariants classes on plain elements."
	>
		<Demo label="A care guide" layout="block">
			<Typography.Root class="max-w-[40rem]">
				<Typography.H1>Planting bare-root roses</Typography.H1>
				<Typography.Lead>
					Bare-root roses arrive dormant, with no soil on the roots. Ours land on {roseArrives}.
					Plant them within a week, while the ground is cold but not frozen.
				</Typography.Lead>
				<Typography.H2>Before you plant</Typography.H2>
				<Typography.P>
					Soak the roots in a bucket of water for two hours. If you cannot plant the same day, heel
					them into a trench or keep them wrapped in a cool shed for up to a week.
				</Typography.P>
				<Typography.H3>What you need</Typography.H3>
				<Typography.List>
					<li>A spade and a garden fork</li>
					<li>One sachet of mycorrhizal fungi per rose</li>
					<li>About a bucket of well-rotted compost per hole</li>
					<li>A stake, if the bed catches the wind off the river</li>
				</Typography.List>
				<Typography.P>
					The till sells all four as one kit for $16.80. Ask for
					<Typography.InlineCode>KIT-ROSE-2</Typography.InlineCode>.
				</Typography.P>
				<Typography.H2>Planting</Typography.H2>
				<Typography.H4>Depth</Typography.H4>
				<Typography.P>
					Set the graft union, the knobbly join where the stems meet the roots, 2 inches below the soil.
					Firm the soil with your heel and water it in, even if it is raining.
				</Typography.P>
				<Typography.Blockquote>
					Most of the roses we lose in the first year die of drought next summer, not frost in
					January.
					<cite>Tomasz Brandt, grower</cite>
				</Typography.Blockquote>
				<Typography.H3>On pre-order</Typography.H3>
				<Typography.Table>
					<thead>
						<tr>
							<th>Variety</th>
							<th>Habit</th>
							<th align="right">Height</th>
							<th align="right">Price</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>‘Gertrude Jekyll’</td>
							<td>Shrub</td>
							<td align="right">5 ft</td>
							<td align="right">{formatMoney(rose.price)}</td>
						</tr>
						<tr>
							<td>‘Albertine’</td>
							<td>Rambler</td>
							<td align="right">15 ft</td>
							<td align="right">$22.00</td>
						</tr>
						<tr>
							<td>‘Munstead Wood’</td>
							<td>Shrub</td>
							<td align="right">3 ft</td>
							<td align="right">$26.75</td>
						</tr>
						<tr>
							<td>‘The Generous Gardener’</td>
							<td>Climber</td>
							<td align="right">10 ft</td>
							<td align="right">$25.40</td>
						</tr>
					</tbody>
				</Typography.Table>
				<Typography.P>
					<Typography.Small>Pre-order prices. Every variety lands on {roseArrives}.</Typography.Small>
				</Typography.P>
			</Typography.Root>
		</Demo>

		<Demo label="On the cool block" tone="cool" layout="block">
			<Typography.Root class="max-w-[40rem]">
				<Typography.H3>Collecting from the shop</Typography.H3>
				<Typography.P>
					Collect from the yard gate on any open day, at no charge. Give the order number, for
					example <Typography.InlineCode>{order('#4481').id}</Typography.InlineCode>, at the gate.
				</Typography.P>
				<Typography.Muted>Open {shop.hours}. Closed on Mondays.</Typography.Muted>
			</Typography.Root>
		</Demo>
	</Section>
</div>
