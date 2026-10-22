<script lang="ts">
	import { onDestroy } from "svelte";
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { Button, type ButtonProps } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		variant = "ghost",
		size = "icon-sm",
		onclick,
		...restProps
	}: Omit<ButtonProps, "onclick"> & {
		value: string;
		onclick?: (e: MouseEvent) => void;
	} = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	function done() {
		copied = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => (copied = false), 2000);
	}

	// Where the async Clipboard API is blocked (embedded browsers, some
	// iframes), fall back to a selection copy so the button still works.
	function fallbackCopy() {
		const area = document.createElement("textarea");
		area.value = value;
		area.setAttribute("readonly", "");
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.append(area);
		area.select();
		const ok = document.execCommand("copy");
		area.remove();
		if (ok) done();
	}

	function copy() {
		if (!navigator.clipboard) {
			fallbackCopy();
			return;
		}
		navigator.clipboard.writeText(value).then(done).catch(fallbackCopy);
	}

	onDestroy(() => clearTimeout(timeout));
</script>

<Button
	bind:ref
	data-slot="code-block-copy-button"
	data-copied={copied || undefined}
	{variant}
	{size}
	aria-label={copied ? "Copied" : "Copy"}
	class={cn("group-data-[size=sm]/code-block:size-8", className)}
	onclick={(e) => {
		onclick?.(e);
		copy();
	}}
	{...restProps}
>
	{#if copied}
		<CheckIcon  />
	{:else}
		<CopyIcon  />
	{/if}
</Button>
<span aria-live="polite" class="sr-only">{copied ? "Copied" : ""}</span>
