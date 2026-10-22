<script lang="ts">
	import * as Dialog from "#lib/components/ui/dialog/index.js";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";
	import Command from "./command.svelte";
	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command palette",
		description = "Search for a command to run.",
		showCloseButton = false,
		portalProps,
		children,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
			title?: string;
			description?: string;
			showCloseButton?: boolean;
			class?: string;
		} = $props();
</script>

<!-- The dialog draws the paper, hairline and radius; the palette sits flush inside it. -->
<Dialog.Root bind:open {...restProps}>
	<Dialog.Content
		class={cn("top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg md:p-0", className)}
		{showCloseButton}
		{portalProps}
	>
		<Dialog.Header class="sr-only">
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>
