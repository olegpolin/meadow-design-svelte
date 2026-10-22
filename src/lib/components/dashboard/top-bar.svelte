<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import SearchIcon from '@lucide/svelte/icons/search';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { shop as hollin, shortcuts } from '#lib/demos/world.js';
	import { ThemeControls } from '#lib/components/site/index.js';
	import { pageTitle } from './nav.js';
	import { getShop } from './shop.svelte.js';

	const shop = getShop();

	let query = $state('');
	let input = $state<HTMLInputElement | null>(null);
	const title = $derived(pageTitle(page.url.pathname));
	/* Pages with their own filter box skip this one on phones, so there is one search per screen. */
	const ownSearch = $derived(/\/(orders|plants|customers)/.test(page.url.pathname));

	/*
	 * One search box for the whole app: an order number opens that order, a
	 * customer name filters the orders, anything else searches the plants.
	 */
	function search(event: SubmitEvent) {
		event.preventDefault();
		const q = query.trim();
		if (!q) return;
		const digits = q.replace(/^#/, '');
		const lower = q.toLowerCase();
		if (/^\d{4}$/.test(digits) && shop.find(`#${digits}`)) {
			goto(`/dashboard/orders?order=${digits}`);
		} else if (shop.orders.some((o) => o.customer.name.toLowerCase().includes(lower))) {
			goto(`/dashboard/orders?q=${encodeURIComponent(q)}`);
		} else {
			goto(`/dashboard/plants?q=${encodeURIComponent(q)}`);
		}
		query = '';
		input?.blur();
	}

	/* Ctrl K jumps to the search box from anywhere in the dashboard. */
	function onkeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			input?.focus();
			input?.select();
		}
	}
</script>

<svelte:window {onkeydown} />

<header
	class="sticky top-0 z-10 flex flex-wrap items-center gap-x-2 gap-y-3 border-b bg-background px-4 py-3 md:h-18 md:flex-nowrap md:px-6 md:py-0"
>
	<Sidebar.Trigger class="-ml-1" />
	<Separator orientation="vertical" class="mr-1 h-5! self-center! max-md:hidden" />
	<Breadcrumb.Root class="min-w-0">
		<Breadcrumb.List class="flex-nowrap">
			<Breadcrumb.Item class="max-sm:hidden">
				<Breadcrumb.Link href="/dashboard">{hollin.name}</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator class="max-sm:hidden" />
			<Breadcrumb.Item>
				<Breadcrumb.Page class="truncate">{title}</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<form
		role="search"
		class={['order-last w-full md:order-none md:ml-auto md:w-72 lg:w-80', ownSearch && 'max-md:hidden']}
		onsubmit={search}
	>
		<InputGroup.Root class="h-10">
			<InputGroup.Addon>
				<SearchIcon aria-hidden="true" />
			</InputGroup.Addon>
			<InputGroup.Input
				type="search"
				aria-label="Search orders, customers and plants"
				aria-keyshortcuts="Control+K"
				placeholder="Order number, customer or plant"
				autocomplete="off"
				bind:ref={input}
				bind:value={query}
			/>
			<InputGroup.Addon align="inline-end" class="max-lg:hidden">
				<Kbd.Group>
					{#each shortcuts.search.keys as key (key)}<Kbd.Root>{key}</Kbd.Root>{/each}
				</Kbd.Group>
			</InputGroup.Addon>
		</InputGroup.Root>
	</form>

	<div class="ml-auto md:ml-2">
		<ThemeControls />
	</div>
</header>
