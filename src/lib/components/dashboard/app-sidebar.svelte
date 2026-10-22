<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Wordmark } from '#lib/components/site/index.js';
	import { shop as hollin, shortcuts, staff } from '#lib/demos/world.js';
	import { adminNav, isCurrent, shopNav, type NavItem } from './nav.js';
	import { getShop } from './shop.svelte.js';

	const sidebar = Sidebar.useSidebar();
	const shop = getShop();

	const counts = $derived({
		toPack: shop.toPack.length,
		stopsLeft: shop.run.length - shop.runDone
	});

	/* On phones the sidebar is a sheet: close it once a page is picked. */
	function closeOnMobile() {
		if (sidebar.isMobile) sidebar.setOpenMobile(false);
	}

	function signOut() {
		toast(`Signed out of ${hollin.name}`, {
			description: 'The demo starts the morning over when you come back.'
		});
		goto('/');
	}
</script>

{#snippet navGroup(label: string, items: NavItem[])}
	<Sidebar.Group>
		<Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
		<Sidebar.GroupContent>
			<Sidebar.Menu>
				{#each items as item (item.href)}
					{@const count = item.count ? counts[item.count] : 0}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={isCurrent(page.url.pathname, item.href)} tooltipContent={item.title}>
							{#snippet child({ props })}
								<a
									href={item.href}
									aria-current={isCurrent(page.url.pathname, item.href) ? 'page' : undefined}
									onclick={closeOnMobile}
									{...props}
								>
									<item.icon />
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						{#if count > 0}
							<Sidebar.MenuBadge aria-label="{count} {item.count === 'toPack' ? 'to pack' : 'stops left'}">
								{count}
							</Sidebar.MenuBadge>
						{/if}
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/snippet}

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg" tooltipContent="Back to the Meadow showcase">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<Wordmark class="[&>svg]:size-7!" />
							<span
								class="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden"
							>
								<ArrowLeftIcon class="size-3!" aria-hidden="true" />
								Showcase
							</span>
							<span class="sr-only">Back to the Meadow showcase</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		{@render navGroup('Shop', shopNav)}
		{@render navGroup('Admin', adminNav)}
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton size="lg" {...props}>
								<Avatar.Root size="sm">
									<Avatar.Fallback>{staff.nell.initials}</Avatar.Fallback>
								</Avatar.Root>
								<span class="flex min-w-0 flex-1 flex-col leading-tight">
									<span class="truncate font-display font-bold">{staff.nell.name}</span>
									<span class="truncate text-xs text-muted-foreground">{staff.nell.email}</span>
								</span>
								<ChevronsUpDownIcon class="ml-auto opacity-70" aria-hidden="true" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						side={sidebar.isMobile ? 'top' : 'right'}
						align="end"
						sideOffset={8}
						class="w-(--bits-dropdown-menu-anchor-width) min-w-60"
					>
						<DropdownMenu.Group>
							<DropdownMenu.Label>{staff.nell.name}, {staff.nell.role.toLowerCase()}</DropdownMenu.Label>
							<DropdownMenu.Item
								onSelect={() => {
									closeOnMobile();
									goto('/dashboard/settings');
								}}
							>
								Shop settings
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => sidebar.toggle()}>
								{shortcuts.sidebar.label}
								<DropdownMenu.Shortcut>{shortcuts.sidebar.keys.join(' ')}</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => goto('/')}>Back to the Meadow showcase</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item onSelect={signOut}>Sign out</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
