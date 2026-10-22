import layoutCss from '../../../routes/layout.css?raw';
import type { PaletteId } from '#lib/theme/palettes.js';

/**
 * The brand colours of every palette, read from the source of
 * `src/routes/layout.css` so the styles page never repeats a value.
 */
export const BRAND_ROLES = ['paper', 'block-a', 'block-b', 'ink', 'ink-soft'] as const;
export type BrandRole = (typeof BRAND_ROLES)[number];
export type BrandColours = Record<BrandRole, string>;

const SELECTORS: Record<PaletteId, { light: string; dark: string }> = {
	meadow: { light: "[data-theme='meadow']", dark: '.dark' },
	orchard: { light: "[data-theme='orchard']", dark: ".dark[data-theme='orchard']" },
	shore: { light: "[data-theme='shore']", dark: ".dark[data-theme='shore']" },
	clay: { light: "[data-theme='clay']", dark: ".dark[data-theme='clay']" }
};

/** Every top-level rule as [selector, body]. The file has no nested rules in the palette blocks. */
const rules = [...layoutCss.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
	// Keep only the text after the last `;` so @import lines do not stick to the first selector.
	(m) => [m[1].split(';').at(-1)!.trim(), m[2]] as const
);

function read(selector: string): BrandColours {
	// The first rule with this selector that defines --paper is the palette block.
	const body =
		rules.find(
			([sel, b]) =>
				sel.split(',').some((s) => s.trim() === selector) && /--paper\s*:/.test(b)
		)?.[1] ?? '';
	const colours = {} as BrandColours;
	for (const role of BRAND_ROLES) {
		const match = body.match(new RegExp(`--${role}\\s*:\\s*([^;]+);`));
		colours[role] = match?.[1].trim() ?? '';
	}
	return colours;
}

export const paletteValues = Object.fromEntries(
	Object.entries(SELECTORS).map(([id, s]) => [id, { light: read(s.light), dark: read(s.dark) }])
) as Record<PaletteId, { light: BrandColours; dark: BrandColours }>;
