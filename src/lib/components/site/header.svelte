<script lang="ts">
	import { page } from '$app/state';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import Wordmark from './wordmark.svelte';
	import ThemeControls from './theme-controls.svelte';
	import { site } from '#lib/config/site.js';
	import { cn } from '#lib/utils.js';

	const navLinks = [
		{ title: 'Components', href: '/components' },
		{ title: 'Styles', href: '/styles' },
		{ title: 'Dashboard', href: '/dashboard' }
	];

	let mobileMenuOpen = $state(false);

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	const focusRing =
		'rounded-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-secondary';
</script>

<!-- The header sits on the warm band every page opens with; the page's intro continues it. -->
<header class="bg-secondary text-secondary-foreground">
	<div class="wrap flex h-20 items-center justify-between gap-6 md:h-24">
		<a href="/" class={cn('flex items-center', focusRing)} aria-label="Meadow, home">
			<Wordmark />
		</a>

		<nav aria-label="Main" class="hidden items-center gap-8 text-[0.9375rem] font-medium md:flex">
			{#each navLinks as { title, href } (href)}
				<a
					{href}
					aria-current={isCurrent(href) ? 'page' : undefined}
					class={cn(
						'decoration-2 underline-offset-[6px] hover:underline aria-[current=page]:underline',
						focusRing
					)}
				>
					{title}
				</a>
			{/each}
			<a
				href={site.repo}
				target="_blank"
				rel="noopener"
				class={cn('inline-flex items-center gap-1 decoration-2 underline-offset-[6px] hover:underline', focusRing)}
			>
				GitHub
				<ArrowUpRightIcon class="size-4" aria-hidden="true" />
			</a>
		</nav>

		<div class="flex items-center gap-2">
			<div class="max-md:hidden">
				<ThemeControls />
			</div>

			<Popover.Root bind:open={mobileMenuOpen}>
				<Popover.Trigger
					class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				>
					<span class="relative block size-5" aria-hidden="true">
						<span
							class={[
								'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-[top,transform] duration-150',
								mobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-1'
							]}
						></span>
						<span
							class={[
								'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-[top,transform] duration-150',
								mobileMenuOpen ? 'top-[9px] rotate-45' : 'top-3.5'
							]}
						></span>
					</span>
				</Popover.Trigger>
				<Popover.Content
					class="h-(--bits-popover-content-available-height) w-(--bits-popover-content-available-width) overflow-y-auto rounded-none border-0 bg-secondary p-0 text-secondary-foreground"
					align="start"
					side="bottom"
					sideOffset={0}
					preventScroll
				>
					<nav aria-label="Main" class="wrap flex min-h-full flex-col gap-10 py-8">
						<ul class="flex flex-col gap-4">
							{#each navLinks as { title, href } (href)}
								<li>
									<a
										{href}
										aria-current={isCurrent(href) ? 'page' : undefined}
										class={cn(
											'font-display text-[2.375rem] leading-none font-extrabold tracking-[-0.04em] aria-[current=page]:underline aria-[current=page]:decoration-4 aria-[current=page]:underline-offset-8 active:opacity-60',
											focusRing
										)}
										onclick={() => (mobileMenuOpen = false)}
									>
										{title}
									</a>
								</li>
							{/each}
							<li>
								<a
									href={site.repo}
									target="_blank"
									rel="noopener"
									class={cn(
										'inline-flex items-center gap-2 font-display text-[2.375rem] leading-none font-extrabold tracking-[-0.04em] active:opacity-60',
										focusRing
									)}
								>
									GitHub
									<ArrowUpRightIcon class="size-8" aria-hidden="true" />
								</a>
							</li>
						</ul>
						<div class="mt-auto border-t pt-6">
							<ThemeControls />
						</div>
					</nav>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
</header>
