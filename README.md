# meadow-design-svelte

Meadow: a design system on top of shadcn-svelte, and a showcase site for it. Warm paper, two soft colour blocks, one ink colour, pill buttons, hairline lists. Four named palettes, each with light and dark. Every shadcn-svelte component is installed and restyled.

- `/` landing page
- `/components` catalog in seven groups
- `/styles` tokens, type, radius, surfaces, motion
- `/dashboard` a demo app composed from the components

## Tech Stack

- **[Svelte](https://svelte.dev)** (Svelte 5) - frontend framework
- **[SvelteKit](https://svelte.dev/docs/kit)** (SvelteKit 3) - full-stack framework
- **[Tailwind CSS](https://tailwindcss.com)** (Tailwind 4) - styling
- **[shadcn-svelte](https://shadcn-svelte.com)** - UI components (built on **[bits-ui](https://bits-ui.com)**)
- **[Fontsource](https://fontsource.org)** - self-hosted variable fonts (Manrope, DM Sans)
- **[mode-watcher](https://github.com/svecosystem/mode-watcher)** - light/dark mode and the named palette (`data-theme`)
- **[LayerChart](https://www.layerchart.com)** (through the shadcn-svelte Chart) - charts
- **[svelte-sonner](https://svelte-sonner.vercel.app)**, **[vaul-svelte](https://vaul-svelte.com)**, **[paneforge](https://paneforge.dev)**, **[Embla Carousel](https://www.embla-carousel.com)**, **[formsnap](https://formsnap.dev)** + **[sveltekit-superforms](https://superforms.rocks)** with **[zod](https://zod.dev)** schemas, **[shiki](https://shiki.style)** - the libraries behind the toast, drawer, resizable, carousel, form and code-block components

## Using it in your own project

It is a normal shadcn-svelte setup. Copy `src/routes/layout.css` for the tokens and type utilities, then copy the folders you need from `src/lib/components/ui`. The site shell and showcase pages are not needed.

## Getting Started

```sh
npm i
npm run dev
```
