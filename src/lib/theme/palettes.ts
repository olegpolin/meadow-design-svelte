/**
 * The named palettes. Each one is five brand colours defined in
 * `src/routes/layout.css` and selected with `data-theme` on <html>
 * (mode-watcher persists it). Meadow is the default and needs no attribute.
 */
export type PaletteId = 'meadow' | 'orchard' | 'shore' | 'clay';

export type Palette = {
	id: PaletteId;
	name: string;
	/** One line about the mood, shown in the picker. */
	description: string;
};

export const palettes: Palette[] = [
	{ id: 'meadow', name: 'Meadow', description: 'Cream paper, butter and lilac, deep green ink.' },
	{ id: 'orchard', name: 'Orchard', description: 'Ivory paper, apricot and sage, plum ink.' },
	{ id: 'shore', name: 'Shore', description: 'Cool paper, sand and sky, navy ink.' },
	{ id: 'clay', name: 'Clay', description: 'Stone paper, terracotta and mist, espresso ink.' }
];

export const DEFAULT_PALETTE: PaletteId = 'meadow';

export function isPaletteId(value: unknown): value is PaletteId {
	return palettes.some((p) => p.id === value);
}
