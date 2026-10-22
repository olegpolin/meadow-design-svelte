/*
 * Meadow typography. shadcn-svelte ships no typography styles, only a page of
 * example classes; these are those classes restyled for Meadow: Manrope 800
 * headings through the display utilities in layout.css, DM Sans body, a
 * hairline-ruled blockquote, plain bullets and tables as hairline rows.
 *
 * Use the components (`Typography.H2`, `Typography.P`, ...) or put these
 * classes on raw elements. Colours follow the current text colour, so the
 * same markup reads on paper, both colour blocks and the ink card.
 */
export const typographyVariants = {
	root: "text-base leading-7 [&>*:first-child]:mt-0",
	h1: "display-2 scroll-m-24",
	h2: "display-3 mt-12 scroll-m-24 first:mt-0",
	h3: "display-4 mt-8 scroll-m-24 first:mt-0",
	h4: "mt-6 scroll-m-24 font-display text-lg leading-snug font-extrabold tracking-[-0.02em] first:mt-0",
	p: "text-base leading-7 [&:not(:first-child)]:mt-5",
	lead: "lead [&:not(:first-child)]:mt-5",
	large: "font-display text-lg leading-snug font-bold",
	small: "text-sm leading-snug font-medium",
	muted: "text-sm leading-normal text-current/75",
	blockquote:
		"mt-8 border-y py-6 font-display text-xl leading-snug font-bold tracking-[-0.02em] text-balance md:text-2xl [&_cite]:mt-3 [&_cite]:block [&_cite]:font-sans [&_cite]:text-sm [&_cite]:font-medium [&_cite]:tracking-normal [&_cite]:not-italic",
	list: "mt-5 ms-5 [&_ol]:mt-2 [&_ul]:mt-2 [&>li]:mt-2 [&>li]:ps-1",
	inlineCode: "rounded-xs bg-current/10 px-[0.3em] py-[0.15em] font-mono text-[0.875em] font-medium",
	tableContainer: "mt-8 w-full overflow-x-auto",
	table:
		"w-full border-collapse border-t text-[0.9375rem] tabular-nums [&_[align=center]]:text-center [&_[align=right]]:text-end [&_td]:py-3 [&_td]:pe-4 [&_td]:align-top [&_td:last-child]:pe-0 [&_th]:py-3 [&_th]:pe-4 [&_th]:text-start [&_th]:align-bottom [&_th]:font-display [&_th]:text-sm [&_th]:font-bold [&_th:last-child]:pe-0 [&_tr]:border-b",
} as const;

export type TypographyVariant = keyof typeof typographyVariants;
