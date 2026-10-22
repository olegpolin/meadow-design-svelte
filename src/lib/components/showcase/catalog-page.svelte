<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { getGroup, neighbours } from '#lib/showcase/groups.js';
	import PageIntro from './page-intro.svelte';

	/**
	 * Shell for one catalog group page: the opening band, a list of the
	 * components on the page, the sections, and links to the neighbouring groups.
	 */
	let {
		group: slug,
		sections,
		children
	}: {
		group: string;
		/** Anchors in page order; `id` must match the `Section` ids. */
		sections: { id: string; title: string }[];
		children: Snippet;
	} = $props();

	const group = $derived(getGroup(slug));
	const { prev, next } = $derived(neighbours(slug));
</script>

<svelte:head>
	<title>{group?.title} · Meadow</title>
	<meta name="description" content={group?.description} />
</svelte:head>

{#if group}
	<PageIntro title={group.title} lead={group.description}>
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
		{@render children()}
	</div>

	<nav aria-label="Catalog" class="wrap mt-8 md:mt-12">
		<div class="grid gap-3 border-t pt-5 sm:grid-cols-2 sm:gap-5 md:pt-8">
			{#if prev}
				<a
					href="/components/{prev.slug}"
					class="group flex flex-col rounded-lg bg-accent p-5 text-accent-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-7"
				>
					<span class="flex items-center gap-1.5 text-xs font-medium">
						<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
						Previous
					</span>
					<span class="display-3 mt-4">{prev.title}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if next}
				<a
					href="/components/{next.slug}"
					class="group flex flex-col items-end rounded-lg bg-secondary p-5 text-right text-secondary-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-7"
				>
					<span class="flex items-center gap-1.5 text-xs font-medium">
						Next
						<ArrowRightIcon class="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</span>
					<span class="display-3 mt-4">{next.title}</span>
				</a>
			{/if}
		</div>
	</nav>
{/if}
