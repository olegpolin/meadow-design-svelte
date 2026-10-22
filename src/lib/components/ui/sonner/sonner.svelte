<script lang="ts">
	import { mode } from "mode-watcher";
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import InfoIcon from '@lucide/svelte/icons/info';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	/*
	 * Toasts are paper with an ink hairline, like every floating layer. Status
	 * is carried by the icon and the text colour only (destructive for errors),
	 * never by a tinted background or a coloured border. svelte-sonner's own
	 * styles are unlayered, so the overrides that compete with them live in the
	 * <style> block below; font families come from Tailwind classes.
	 */
	let { toastOptions, ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	style="--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --border-radius: var(--radius);"
	toastOptions={{
		...toastOptions,
		classes: {
			toast: "cn-toast font-sans",
			title: "font-display",
			actionButton: "font-display",
			cancelButton: "font-display",
			...toastOptions?.classes,
		},
	}}
	{...restProps}
>
	{#snippet loadingIcon()}
		<Loader2Icon class="size-4 animate-spin" />
	{/snippet}
	{#snippet successIcon()}
		<CircleCheckIcon class="size-4" />
	{/snippet}
	{#snippet errorIcon()}
		<OctagonXIcon class="size-4" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" />
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlertIcon class="size-4" />
	{/snippet}
</Sonner>

<style>
	/* `.cn-toast` is doubled to outrank svelte-sonner's theme selectors. */
	:global {
		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] {
			align-items: flex-start;
			gap: 0.75rem;
			padding: 1rem 1.125rem;
			border-radius: var(--radius);
			box-shadow: none;
			font-size: 0.9375rem;
			line-height: 1.4;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast:focus-visible {
			box-shadow: none;
			outline: 3px solid color-mix(in oklab, var(--ring) 60%, transparent);
			outline-offset: 2px;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-icon] {
			height: 1.3125rem;
			width: 1rem;
			margin: 0;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-content] {
			gap: 0.125rem;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-title] {
			font-weight: 700;
			line-height: 1.4;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-description] {
			color: var(--muted-foreground);
			font-size: 0.875rem;
			line-height: 1.45;
		}

		/* Errors change the text colour of the icon and the title, nothing else. */
		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-type='error'] [data-icon],
		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-type='error'] [data-title] {
			color: var(--destructive);
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-button] {
			align-self: center;
			height: 2rem;
			padding-inline: 0.875rem;
			border-radius: 999px;
			background: var(--primary);
			color: var(--primary-foreground);
			font-size: 0.8125rem;
			font-weight: 700;
			transition: opacity 150ms ease-out;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-button]:hover {
			opacity: 0.9;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-cancel] {
			background: color-mix(in oklab, currentColor 10%, transparent);
			color: inherit;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-button]:focus-visible,
		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-close-button]:focus-visible {
			box-shadow: none;
			outline: 3px solid color-mix(in oklab, var(--ring) 60%, transparent);
			outline-offset: 2px;
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true'] [data-close-button] {
			background: var(--popover);
			border-color: var(--border);
			color: var(--popover-foreground);
		}

		[data-sonner-toaster] [data-sonner-toast].cn-toast.cn-toast[data-styled='true']:hover [data-close-button]:hover {
			background: var(--muted);
			border-color: var(--border);
		}
	}
</style>
