<script lang="ts">
	import { setTheme, theme } from 'mode-watcher';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Button } from '#lib/components/ui/button/index.js';
	import OrderCard from '#lib/components/landing/order-card.svelte';
	import { groups } from '#lib/showcase/groups.js';
	import { DEFAULT_PALETTE, isPaletteId, palettes } from '#lib/theme/palettes.js';

	const count = groups.reduce((n, g) => n + g.items.length, 0);

	let current = $derived(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);

	const rules = [
		{
			title: 'Paper and ink',
			text: 'The page is paper. Text, hairlines, buttons and the closing card are all one deep ink.'
		},
		{
			title: 'Two colour blocks',
			text: 'A warm tint opens every page and a cool tint marks a change of subject. Nothing else gets a colour.'
		},
		{
			title: 'Pills and hairlines',
			text: 'Buttons, inputs and badges are pills. Lists are split by 1px ink lines instead of boxed in cards.'
		},
		{
			title: 'Manrope and DM Sans',
			text: 'Headings in Manrope 800, buttons in Manrope 700, everything else in DM Sans, all in sentence case.'
		},
		{
			title: 'No shadows, no gradients',
			text: 'Menus and dialogs are paper with an ink outline. Every colour is flat.'
		},
		{
			title: 'Tokens only',
			text: 'Components use the semantic tokens, so a new palette or the dark mode needs no component changes.'
		}
	];
</script>

<svelte:head>
	<title>Meadow</title>
	<meta
		name="description"
		content="Meadow is a design system for shadcn-svelte: one set of tokens, four palettes with dark modes, and {count} restyled components to copy into a Svelte project."
	/>
</svelte:head>

<!-- Hero: continues the header's warm band. -->
<section class="bg-secondary text-secondary-foreground">
	<div
		class="wrap grid gap-10 pt-4 pb-12 md:pt-10 md:pb-20 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-end xl:gap-16"
	>
		<div>
			<h1 class="display-1">Paper, two tints and one ink.</h1>
			<p class="lead mt-5 max-w-[34rem] md:mt-8">
				Meadow is one set of tokens and {count} restyled shadcn-svelte components for Svelte 5 and
				Tailwind 4, built to be copied a piece at a time.
			</p>
			<div class="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4 md:mt-10">
				<Button href="/components" size="lg">Browse the components</Button>
				<Button href="/styles" variant="outline" size="lg">See the tokens</Button>
			</div>
		</div>
		<!-- Stacked until xl: beside a 3fr column at lg the headline would break into four lines. -->
		<OrderCard class="w-full max-w-md xl:max-w-none" />
	</div>
</section>

<!-- What is in the system -->
<section class="wrap section-gap grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
	<div>
		<h2 class="display-2">Seven groups of components.</h2>
		<p class="lead mt-4 max-w-[26rem] text-muted-foreground md:mt-6">
			Each group has its own page, with every component shown on paper, on the colour blocks and
			on the ink card.
		</p>
	</div>
	<ul class="border-t">
		{#each groups as group (group.slug)}
			<li class="border-b">
				<a
					href="/components/{group.slug}"
					class="group flex items-start justify-between gap-6 rounded-xs py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:py-6"
				>
					<span class="flex min-w-0 flex-col gap-1.5">
						<span class="row-title decoration-3 underline-offset-[6px] group-hover:underline">
							{group.title}
						</span>
						<span class="text-sm leading-normal text-muted-foreground md:text-base">
							{group.description}
						</span>
					</span>
					<span class="flex shrink-0 items-center gap-1.5 pt-1 text-sm font-medium tabular-nums md:pt-2">
						{group.items.length}
						<span class="max-sm:sr-only">components</span>
						<ArrowRightIcon
							class="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<!-- The palettes -->
<section class="wrap section-gap">
	<h2 class="display-2">Four palettes.</h2>
	<p class="lead mt-4 max-w-[40rem] text-muted-foreground md:mt-6">
		Each is five colours: paper, a warm tint, a cool tint, an ink and a softer ink. Every palette
		has a dark mode, switched with the sun and moon in the header.
	</p>
	<ul class="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-5 xl:grid-cols-4">
		{#each palettes as palette (palette.id)}
			{@const active = palette.id === current}
			<!-- data-theme repaints the brand colours inside this block only. -->
			<li
				data-theme={palette.id}
				class="flex flex-col overflow-hidden rounded-[1.5rem] bg-block-a text-ink md:rounded-block"
			>
				<div class="flex flex-1 flex-col p-6 md:p-7">
					<h3 class="display-3">{palette.name}</h3>
					<p class="mt-2 text-sm leading-normal md:text-[0.9375rem]">{palette.description}</p>
					<div class="mt-6 flex flex-1 items-end md:mt-8">
						<Button
							variant="outline"
							size="sm"
							aria-pressed={active}
							class="aria-pressed:bg-current/10"
							onclick={() => setTheme(palette.id)}
						>
							{active ? `Using ${palette.name}` : `Use ${palette.name}`}
						</Button>
					</div>
				</div>
				<div class="grid h-12 grid-cols-[2fr_1fr_1fr] md:h-16" aria-hidden="true">
					<span class="bg-block-b"></span>
					<span class="bg-paper"></span>
					<span class="bg-ink"></span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- How it is built -->
<section class="wrap section-gap">
	<div
		class="grid gap-8 rounded-[1.5rem] bg-accent p-6 text-accent-foreground md:rounded-block md:p-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16"
	>
		<h2 class="display-2">The rules it keeps.</h2>
		<ul class="border-t">
			{#each rules as rule (rule.title)}
				<li class="grid gap-1.5 border-b py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8 md:py-6 lg:grid-cols-1 lg:gap-1.5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-8">
					<h3 class="display-4">{rule.title}</h3>
					<p class="text-[0.9375rem] leading-normal md:text-base">{rule.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Use it -->
<section class="wrap section-gap">
	<h2 class="display-2 max-w-[18ch]">It is a normal <span class="whitespace-nowrap">shadcn-svelte</span> project.</h2>
	<div class="mt-8 grid gap-6 border-t pt-6 md:mt-12 md:grid-cols-2 md:gap-16 md:pt-8">
		<p class="lead">
			Meadow runs on SvelteKit, Svelte 5 and Tailwind 4. There is no
			package to install. Run the shadcn-svelte init in your app, then replace its CSS with
			<code class="font-mono text-[0.9em]">src/routes/layout.css</code>, which holds the tokens,
			the four palettes and the type styles. It imports Manrope and DM Sans from Fontsource, so add
			those two packages too.
		</p>
		<div class="flex flex-col items-start gap-6">
			<p class="lead">
				Then copy the component folders you need from
				<code class="font-mono text-[0.9em]">src/lib/components/ui</code>. Each one lists its
				imports at the top: bits-ui, the shared <code class="font-mono text-[0.9em]">cn()</code>
				helper, and sometimes another folder, such as Button.
			</p>
			<Button href="/components" variant="outline">Browse the components</Button>
		</div>
	</div>
</section>
