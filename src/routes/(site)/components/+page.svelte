<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { PageIntro } from '#lib/components/showcase/index.js';
	import { groups } from '#lib/showcase/groups.js';

	const count = groups.reduce((n, g) => n + g.items.length, 0);
</script>

<svelte:head>
	<title>Components · Meadow</title>
	<meta name="description" content="Every shadcn-svelte component, restyled for Meadow, in seven groups." />
</svelte:head>

<PageIntro
	title="Components"
	lead="Every shadcn-svelte component, restyled. {count} of them, in seven groups, shown on paper, on the colour blocks and on the ink card."
/>

<div class="wrap mt-6 md:mt-10">
	<ol class="border-t">
		{#each groups as group, i (group.slug)}
			<li class="border-b">
				<a
					href="/components/{group.slug}"
					class="group grid gap-x-8 gap-y-2 rounded-xs py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-baseline md:py-7"
				>
					<span class="row-title decoration-3 underline-offset-[6px] group-hover:underline">
						{group.title}
					</span>
					<span class="flex flex-col gap-1.5 text-sm leading-normal text-muted-foreground md:text-base">
						<span>{group.description}</span>
						<span class="text-xs md:text-[0.8125rem]">{group.items.join(', ')}</span>
					</span>
					<span class="hidden items-center gap-1.5 text-xs font-medium md:flex">
						{group.items.length} components
						<ArrowRightIcon class="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
