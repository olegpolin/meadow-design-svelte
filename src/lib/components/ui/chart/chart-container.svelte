<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import ChartStyle from "./chart-style.svelte";
	import { setChartContext, type ChartConfig } from "./chart-utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = uid,
		class: className,
		children,
		config,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		config: ChartConfig;
	} = $props();

	const chartId = $derived(`chart-${id || uid.replace(/:/g, "")}`);

	setChartContext({
		get config() {
			return config;
		},
	});
</script>

<div
	bind:this={ref}
	data-chart={chartId}
	data-slot="chart"
	class={cn(
		"flex aspect-video justify-center overflow-visible font-sans text-xs",
		// Meadow overrides. The chart is transparent, so its chrome (gridlines, tick
		// labels, legend) follows the current text colour and works on paper, on
		// both colour blocks and on the ink card. Series colours come from the
		// config (`var(--chart-1)` .. `var(--chart-5)`).
		//
		// Stroke around dots/marks when hovering
		"[&_.lc-highlight-point]:stroke-transparent",
		// Line marks draw in their series colour; the fallback is a soft hairline
		"[&_.lc-line]:stroke-current/20",

		// by default, layerchart shows a line intersecting the point when hovering, this hides that
		"[&_.lc-highlight-line]:stroke-0",
		// The hover band behind bars: a faint tint of the current colour
		"[&_.lc-highlight-area]:fill-current/5",

		// by default, when you hover a point on a stacked series chart, it will drop the opacity
		// of the other series, this overrides that
		"[&_.lc-area-path]:opacity-100 [&_.lc-highlight-line]:opacity-100 [&_.lc-highlight-point]:opacity-100 [&_.lc-spline-path]:opacity-100 [&_.lc-text]:text-xs [&_.lc-text-svg]:overflow-visible",

		// Bars are flat fills: no outline stroke.
		"[&_.lc-bar]:stroke-none",

		// No tick marks between the axis labels and the chart.
		"[&_.lc-axis-tick]:stroke-0",

		// No axis rules: the gridline at zero already marks the baseline, and the
		// rule would overlap the marks because it renders after them.
		"[&_.lc-rule-x-line:not(.lc-grid-x-rule)]:stroke-0 [&_.lc-rule-y-line:not(.lc-grid-y-rule)]:stroke-0",
		// Gridlines: 10% hairlines in the current colour
		"[&_.lc-grid-x-rule]:stroke-current/10 [&_.lc-grid-y-rule]:stroke-current/10",
		"[&_.lc-grid-x-end-rule]:stroke-current/10 [&_.lc-grid-y-end-rule]:stroke-current/10",
		"[&_.lc-grid-x-radial-line]:stroke-current/10 [&_.lc-grid-y-radial-circle]:stroke-current/10 [&_.lc-grid-y-radial-line]:stroke-current/10",

		// Legend: plain text with a small round swatch
		"[&_.lc-legend-swatch-group]:items-center [&_.lc-legend-swatch-group]:gap-5",
		"[&_.lc-legend-swatch-button]:items-center [&_.lc-legend-swatch-button]:gap-2 [&_.lc-legend-swatch-button]:rounded-xs [&_.lc-legend-swatch-button]:outline-none [&_.lc-legend-swatch-button]:focus-visible:ring-3 [&_.lc-legend-swatch-button]:focus-visible:ring-ring/60",
		"[&_.lc-legend-swatch]:size-2.5 [&_.lc-legend-swatch]:rounded-full",
		"[&_.lc-legend-swatch-label]:text-xs [&_.lc-legend-swatch-label]:font-medium",

		// Labels
		"[&_.lc-labels-text:not([fill])]:fill-current [&_text]:stroke-transparent",

		// Tick labels on the x/y axes: small, soft
		"[&_.lc-axis-tick-label]:fill-current/70 [&_.lc-axis-tick-label]:text-xs [&_.lc-axis-tick-label]:font-normal",
		"[&_.lc-tooltip-rects-g]:fill-transparent",
		"[&_.lc-layout-svg-g]:fill-transparent",
		"[&_.lc-root-container]:w-full",
		className
	)}
	{...restProps}
>
	<ChartStyle id={chartId} {config} />
	{@render children?.()}
</div>
