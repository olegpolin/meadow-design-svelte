<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();
</script>

<!-- One 12px-radius box per character; the active box carries the focus ring. -->
<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	class={cn(
		"relative flex size-10 items-center justify-center rounded-md border border-hairline font-display text-lg font-bold sm:size-12 sm:text-xl tabular-nums outline-none transition-[border-color,box-shadow] duration-150 aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:ring-3 data-[active=true]:ring-ring/60 data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-background data-[active=true]:aria-invalid:ring-destructive/40",
		className
	)}
	{...restProps}
>
	{#snippet child({ props })}
		<div {...props} data-active={cell.isActive}>
			{cell.char}
			{#if cell.hasFakeCaret}
				<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div class="caret h-5 w-px bg-current"></div>
				</div>
			{/if}
		</div>
	{/snippet}
</InputOTPPrimitive.Cell>

<style>
	/* The caret blinks only while the box is waiting for input. */
	.caret {
		animation: caret-blink 1.1s ease-out infinite;
	}
	@keyframes caret-blink {
		0%,
		70%,
		100% {
			opacity: 1;
		}
		20%,
		50% {
			opacity: 0;
		}
	}
</style>
