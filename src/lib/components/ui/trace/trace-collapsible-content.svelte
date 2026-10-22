<script lang="ts">
	import * as Collapsible from "#lib/components/ui/collapsible/index.js";
	import { cn, type WithoutChild } from "#lib/utils.js";
	import type { Collapsible as CollapsiblePrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.ContentProps> = $props();
</script>

<Collapsible.Content
	bind:ref
	data-slot="trace-collapsible-content"
	class="duration-200 min-w-0 overflow-hidden [--bits-accordion-content-height:var(--bits-collapsible-content-height)] data-open:animate-accordion-down data-closed:animate-accordion-up"
	{...restProps}
>
	<div
		data-slot="trace-collapsible-content-inner"
		class={cn(
			// A hairline indent under the row's icon: nested steps read as a tree.
			"ms-[calc(--spacing(2)_-_0.5px)] mt-1 mb-2 flex min-w-0 flex-col gap-2 border-s border-hairline ps-5 pe-1 text-[0.9375rem] leading-relaxed wrap-break-word text-current/80",
			className
		)}
	>
		{@render children?.()}
	</div>
</Collapsible.Content>
