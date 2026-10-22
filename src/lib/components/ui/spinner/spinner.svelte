<script lang="ts">
	import { cn } from "#lib/utils.js";
	import type { SVGAttributes } from "svelte/elements";

	/*
	 * A thin ring in the current text colour: a faint full circle with a
	 * quarter arc that turns. Inherits colour, so it works inside any button
	 * and on every surface.
	 */
	let {
		class: className,
		role = "status",
		// name, color, stroke and className are accepted for compatibility with
		// icon-library props; `name` has no meaning on a plain SVG and is dropped.
		name: _name,
		color,
		stroke,
		className: legacyClassName,
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	data-slot="spinner"
	{role}
	aria-label={ariaLabel}
	class={cn("size-4 shrink-0 animate-spin", legacyClassName, className)}
	{...color != null ? { color } : {}}
	{...restProps}
>
	<circle cx="12" cy="12" r="9.5" stroke-opacity="0.2" />
	<path d="M21.5 12A9.5 9.5 0 0 0 12 2.5" {...stroke != null ? { stroke } : {}} />
</svg>
