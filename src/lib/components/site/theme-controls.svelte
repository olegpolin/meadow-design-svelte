<script lang="ts">
	import { setTheme, theme, userPrefersMode } from 'mode-watcher';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { DEFAULT_PALETTE, isPaletteId, palettes, type PaletteId } from '#lib/theme/palettes.js';
	import { cn } from '#lib/utils.js';

	type Mode = 'light' | 'dark' | 'system';

	const modes: { value: Mode; label: string; icon: typeof SunIcon }[] = [
		{ value: 'light', label: 'Light', icon: SunIcon },
		{ value: 'dark', label: 'Dark', icon: MoonIcon },
		{ value: 'system', label: 'System', icon: MonitorIcon }
	];

	let current = $derived<PaletteId>(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);
	let open = $state(false);

	function choose(id: PaletteId) {
		setTheme(id);
		open = false;
	}
</script>

<div class="flex items-center gap-2">
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2.5 pl-3')}
			aria-label="Palette: {palettes.find((p) => p.id === current)?.name}"
		>
			<span class="flex -space-x-1" aria-hidden="true">
				<span class="size-3.5 rounded-full bg-block-a ring-1 ring-current/40"></span>
				<span class="size-3.5 rounded-full bg-block-b ring-1 ring-current/40"></span>
			</span>
			<span class="max-sm:sr-only">{palettes.find((p) => p.id === current)?.name}</span>
		</Popover.Trigger>
		<Popover.Content align="end" class="w-72 p-2">
			<ul class="flex flex-col" aria-label="Palette">
				{#each palettes as palette (palette.id)}
					{@const active = palette.id === current}
					<li>
						<button
							type="button"
							data-theme={palette.id}
							aria-pressed={active}
							class="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/60"
							onclick={() => choose(palette.id)}
						>
							<span class="flex shrink-0 items-center -space-x-1.5" aria-hidden="true">
								<span class="size-5 rounded-full bg-paper ring-1 ring-ink/40"></span>
								<span class="size-5 rounded-full bg-block-a ring-1 ring-ink/40"></span>
								<span class="size-5 rounded-full bg-block-b ring-1 ring-ink/40"></span>
								<span class="size-5 rounded-full bg-ink ring-1 ring-ink/40"></span>
							</span>
							<span class="flex min-w-0 flex-1 flex-col text-foreground">
								<span class="font-display text-sm font-bold">{palette.name}</span>
								<span class="text-xs leading-snug text-muted-foreground">{palette.description}</span>
							</span>
							{#if active}
								<CheckIcon class="size-4 shrink-0 text-foreground" aria-hidden="true" />
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</Popover.Content>
	</Popover.Root>

	<ToggleGroup.Root
		type="single"
		spacing={1}
		size="sm"
		aria-label="Colour mode"
		class="rounded-full border border-current/30 p-0.5"
		bind:value={
			() => userPrefersMode.current,
			(value) => {
				if (value) userPrefersMode.current = value as Mode;
			}
		}
	>
		{#each modes as { value, label, icon: Icon } (value)}
			<ToggleGroup.Item {value} aria-label={label} class="rounded-full">
				<Icon aria-hidden="true" />
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
