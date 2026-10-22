<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	/*
	 * A hairline box for a message that needs attention. No coloured side
	 * stripe: `default` and `destructive` sit on paper, `accent` and
	 * `secondary` use the cool and warm colour blocks. Inside the ink card the
	 * `default` box turns into a hairline outline in the current colour, so it
	 * does not read as a card stuck on a card.
	 *
	 * No role by default: a static alert on the page should not be announced on
	 * load. Pass `role="alert"` (or `role="status"`) for messages that appear
	 * in response to something the user did.
	 */
	export const alertVariants = tv({
		base: "group/alert relative grid w-full gap-1 rounded-lg border p-5 text-left text-[0.9375rem] leading-normal has-data-[slot=alert-action]:pr-16 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-5",
		variants: {
			variant: {
				default: "bg-card text-card-foreground [.bg-primary_&]:border-hairline [.bg-primary_&]:bg-transparent [.bg-primary_&]:text-current [.bg-primary_&]:*:data-[slot=alert-description]:text-current/85",
				destructive: "border-destructive/50 bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90",
				accent: "border-transparent bg-accent text-accent-foreground *:data-[slot=alert-description]:text-current/85",
				secondary: "border-transparent bg-secondary text-secondary-foreground *:data-[slot=alert-description]:text-current/85",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		role = undefined,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	{role}
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
