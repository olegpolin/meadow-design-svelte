<script lang="ts">
	import { BarChart } from 'layerchart';
	import * as Chart from '#lib/components/ui/chart/index.js';
	import { formatMoney, formatMonthDay, weeklyTakings, weeklyTotal } from '#lib/demos/world.js';

	const config = {
		sales: { label: 'Sales', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	/* One bar a week, from the module's takings by category. */
	const data = weeklyTakings.map((w) => ({ week: new Date(`${w.week}T12:00:00`), sales: weeklyTotal(w) }));

	const formatShort = (d: Date) => formatMonthDay(d.toISOString());
	const formatThousands = (v: number) =>
		v === 0 ? '$0' : `$${(v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`;

	const last = weeklyTakings.at(-1)!;
	const before = weeklyTakings.at(-2)!;
	const change = weeklyTotal(last) - weeklyTotal(before);
	const total = weeklyTakings.reduce((sum, w) => sum + weeklyTotal(w), 0);
</script>

<section aria-labelledby="takings-heading" class="flex min-w-0 flex-col gap-4">
	<div class="flex flex-col gap-1">
		<h2 id="takings-heading" class="display-4">Sales, last 12 weeks</h2>
		<p class="max-w-prose text-[0.9375rem] text-muted-foreground">
			Week of {formatMonthDay(last.week)}:
			<span class="font-medium text-foreground tabular-nums">{formatMoney(weeklyTotal(last))}</span>,
			{change < 0 ? 'down' : 'up'} <span class="tabular-nums">{formatMoney(Math.abs(change))}</span> on the week
			before.
		</p>
	</div>
	<Chart.Container {config} class="aspect-auto h-64 w-full md:h-72">
		<BarChart
			{data}
			x="week"
			y="sales"
			bandPadding={0.3}
			series={[{ key: 'sales', label: config.sales.label, color: config.sales.color }]}
			props={{
				bars: { radius: 6 },
				xAxis: {
					format: (d: Date) => formatShort(d),
					ticks: (scale) => scale.domain().filter((_: Date, i: number) => i % 3 === 0)
				},
				yAxis: { format: (v: number) => formatThousands(v), ticks: 4 }
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip
					labelFormatter={(d: Date) => `Week of ${formatShort(d)}`}
					valueFormatter={(v) => formatMoney(Number(v))}
				/>
			{/snippet}
		</BarChart>
	</Chart.Container>
	<p class="text-sm text-muted-foreground tabular-nums">
		{formatMoney(total)} over the 12 weeks. The dips are the heat wave in the week of August 17 and the wet weekend of
		September 26 and 27.
	</p>
</section>
