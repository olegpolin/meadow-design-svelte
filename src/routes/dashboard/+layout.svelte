<script lang="ts">
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import AppSidebar from '#lib/components/dashboard/app-sidebar.svelte';
	import TopBar from '#lib/components/dashboard/top-bar.svelte';
	import { Shop, setShop } from '#lib/components/dashboard/shop.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	/* One shop per visit to the dashboard; every page reads it from context. */
	setShop(new Shop());
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<TopBar />
		<div class="flex flex-1 flex-col px-4 pt-6 pb-16 md:px-8 md:pt-8">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
