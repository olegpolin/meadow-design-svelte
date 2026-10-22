<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import type { PlantCategory } from '#lib/demos/world.js';
	import { categories } from './data.js';
	import { getShop } from './shop.svelte.js';

	let { onAdded }: { onAdded?: (id: string) => void } = $props();

	const shop = getShop();
	const categoryItems = categories.map((c) => ({ value: c, label: c }));

	let open = $state(false);
	let tried = $state(false);
	let name = $state('');
	let category = $state('');
	let form = $state('');
	let location = $state('');
	let price = $state<number | null>(null);
	let inStock = $state<number | null>(null);
	let care = $state('');

	const errors = $derived({
		name: tried && !name.trim() ? 'Add the name as it goes on the label.' : '',
		category: tried && !category ? 'Pick a category so it shows up in the right filter.' : '',
		price: tried && (price === null || price <= 0) ? 'Add a price above $0.' : '',
		inStock: tried && (inStock === null || inStock < 0) ? 'Count what is on the bench. Zero is fine.' : ''
	});

	function reset(isOpen: boolean) {
		if (!isOpen) return;
		tried = false;
		name = category = form = location = care = '';
		price = null;
		inStock = 0;
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		tried = true;
		if (Object.values(errors).some(Boolean)) return;
		const stock = inStock ?? 0;
		const id = shop.addPlant({
			name: name.trim(),
			category: category as PlantCategory,
			form: form.trim() || 'Pot size not set',
			location: location.trim() || 'Not placed yet',
			stock,
			reserved: 0,
			price: price ?? 0,
			care: care.trim()
		});
		open = false;
		toast.success(`${name.trim()} added`, { description: `${stock} in stock, listed under ${category}.` });
		onAdded?.(id);
	}
</script>

<Dialog.Root bind:open onOpenChange={reset}>
	<Dialog.Trigger class={buttonVariants()}>
		Add plant
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[calc(100dvh-2rem)] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Add a plant</Dialog.Title>
			<Dialog.Description>It goes on the stock list now and on the website once it has a photo.</Dialog.Description>
		</Dialog.Header>
		<form id="add-plant" onsubmit={save} novalidate>
			<Field.Group>
				<Field.Field data-invalid={errors.name ? true : undefined}>
					<Field.Label for="plant-name">Name</Field.Label>
					<Input id="plant-name" bind:value={name} placeholder="Salvia ‘Amistad’" aria-invalid={errors.name ? true : undefined} />
					{#if errors.name}<Field.Error>{errors.name}</Field.Error>{/if}
				</Field.Field>
				<div class="grid gap-5 sm:grid-cols-2">
					<Field.Field data-invalid={errors.category ? true : undefined}>
						<Field.Label for="plant-category">Category</Field.Label>
						<Select.Root type="single" items={categoryItems} bind:value={category}>
							<Select.Trigger id="plant-category" class="w-full" aria-invalid={errors.category ? true : undefined}>
								<Select.Value placeholder="Choose one" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each categoryItems as c (c.value)}
										<Select.Item value={c.value} label={c.label} />
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
						{#if errors.category}<Field.Error>{errors.category}</Field.Error>{/if}
					</Field.Field>
					<Field.Field>
						<Field.Label for="plant-form">Pot or form</Field.Label>
						<Input id="plant-form" bind:value={form} placeholder="2 L pot" />
					</Field.Field>
					<Field.Field data-invalid={errors.price ? true : undefined}>
						<Field.Label for="plant-price">Price ($)</Field.Label>
						<Input
							id="plant-price"
							type="number"
							inputmode="decimal"
							min="0"
							step="0.05"
							bind:value={price}
							placeholder="9.80"
							aria-invalid={errors.price ? true : undefined}
						/>
						{#if errors.price}<Field.Error>{errors.price}</Field.Error>{/if}
					</Field.Field>
					<Field.Field data-invalid={errors.inStock ? true : undefined}>
						<Field.Label for="plant-stock">In stock</Field.Label>
						<Input
							id="plant-stock"
							type="number"
							inputmode="numeric"
							min="0"
							bind:value={inStock}
							aria-invalid={errors.inStock ? true : undefined}
						/>
						{#if errors.inStock}<Field.Error>{errors.inStock}</Field.Error>{/if}
					</Field.Field>
				</div>
				<Field.Field>
					<Field.Label for="plant-location">Where it is</Field.Label>
					<Input id="plant-location" bind:value={location} placeholder="Polytunnel 2" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="plant-notes">Care notes</Field.Label>
					<Textarea id="plant-notes" bind:value={care} placeholder="Full sun, sharp drainage. Printed on the care card." />
				</Field.Field>
			</Field.Group>
		</form>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<Button type="submit" form="add-plant">Add plant</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
