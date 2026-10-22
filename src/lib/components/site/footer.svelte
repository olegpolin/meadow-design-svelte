<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import Wordmark from './wordmark.svelte';
	import ThemeControls from './theme-controls.svelte';

	const year = new Date().getFullYear();
</script>

<!-- Every page closes on the ink card. -->
<footer class="wrap section-gap pb-5 md:pb-8">
	<div
		class="grid gap-10 rounded-[1.5rem] bg-primary p-6 text-primary-foreground md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:rounded-block md:p-14"
	>
		<div>
			<h2 class="display-2">Built to be copied.</h2>
			<p class="lead mt-4 max-w-[30rem] md:mt-6">
				Meadow is a shadcn-svelte setup with its own tokens and every component restyled. Take the
				CSS, take the components you need, and leave the rest.
			</p>
			<div class="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
				<Button href="/components" variant="secondary">Browse the components</Button>
				<Button href="/styles" variant="outline">See the tokens</Button>
			</div>
		</div>
		<div class="flex flex-col justify-between gap-8 md:items-end md:text-right">
			<Wordmark class="md:flex-row-reverse" />
			<div class="flex flex-col gap-4 md:items-end">
				<ThemeControls />
				<p class="text-xs opacity-80">Meadow, {year}. Built on shadcn-svelte.</p>
			</div>
		</div>
	</div>
</footer>
