import {
	createCssVariablesTheme,
	createHighlighterCore,
	getTokenStyleObject,
	stringifyTokenStyle,
	type GrammarState,
	type HighlighterCore,
	type ThemedToken,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Add the languages you need. Each one loads the first time it is used.
const languages = {
	bash: () => import("shiki/langs/shellscript.mjs"),
	css: () => import("shiki/langs/css.mjs"),
	diff: () => import("shiki/langs/diff.mjs"),
	html: () => import("shiki/langs/html.mjs"),
	javascript: () => import("shiki/langs/javascript.mjs"),
	json: () => import("shiki/langs/json.mjs"),
	jsx: () => import("shiki/langs/jsx.mjs"),
	markdown: () => import("shiki/langs/markdown.mjs"),
	python: () => import("shiki/langs/python.mjs"),
	sql: () => import("shiki/langs/sql.mjs"),
	svelte: () => import("shiki/langs/svelte.mjs"),
	tsx: () => import("shiki/langs/tsx.mjs"),
	typescript: () => import("shiki/langs/typescript.mjs"),
	yaml: () => import("shiki/langs/yaml.mjs"),
};

const aliases: Record<string, keyof typeof languages> = {
	js: "javascript",
	md: "markdown",
	py: "python",
	sh: "bash",
	shell: "bash",
	shellscript: "bash",
	ts: "typescript",
	yml: "yaml",
	zsh: "bash",
};

/*
 * Meadow's code theme. Every token colour is a CSS variable that falls back to
 * a semantic token, so code follows light and dark mode and all four palettes
 * with no hex values. The scheme is ink-on-paper: keywords and tags are bold
 * ink, names are ink, strings and punctuation are the soft ink, comments are
 * the soft ink at 70% in italics, and removed lines and ANSI red use the
 * destructive token. Override any `--code-*` variable on a parent to adjust it.
 */
const ink = "var(--card-foreground)";
const soft = "var(--muted-foreground)";
const faint = "color-mix(in oklab, var(--muted-foreground) 70%, transparent)";
const danger = "var(--destructive)";

const meadowTheme = createCssVariablesTheme({
	name: "meadow",
	variablePrefix: "--code-",
	fontStyle: true,
	variableDefaults: {
		foreground: ink,
		background: "var(--card)",
		"token-keyword": ink,
		"token-function": ink,
		"token-constant": ink,
		"token-parameter": ink,
		"token-link": ink,
		"token-inserted": ink,
		"token-string": soft,
		"token-string-expression": soft,
		"token-punctuation": soft,
		"token-changed": soft,
		"token-comment": faint,
		"token-deleted": danger,
		"ansi-black": soft,
		"ansi-red": danger,
		"ansi-green": ink,
		"ansi-yellow": ink,
		"ansi-blue": ink,
		"ansi-magenta": ink,
		"ansi-cyan": ink,
		"ansi-white": soft,
		"ansi-bright-black": faint,
		"ansi-bright-red": danger,
		"ansi-bright-green": ink,
		"ansi-bright-yellow": ink,
		"ansi-bright-blue": ink,
		"ansi-bright-magenta": ink,
		"ansi-bright-cyan": ink,
		"ansi-bright-white": soft,
	},
});

// With one ink colour doing most of the work, weight and slant carry the
// structure: keywords and tags are bold, comments are italic. Tags read as
// ink, not as strings.
meadowTheme.tokenColors = [
	...(meadowTheme.tokenColors ?? []),
	{
		scope: ["entity.name.tag", "support.class.component"],
		settings: { foreground: "var(--code-token-tag, var(--card-foreground))" },
	},
	{
		scope: ["keyword.control", "keyword.other", "storage.type", "storage.modifier", "entity.name.tag", "support.class.component"],
		settings: { fontStyle: "bold" },
	},
	{
		scope: ["comment", "punctuation.definition.comment"],
		settings: { fontStyle: "italic" },
	},
];

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
	highlighter ??= createHighlighterCore({
		themes: [meadowTheme],
		langs: [],
		engine: createJavaScriptRegexEngine({ forgiving: true }),
	});

	return highlighter;
}

function getLanguage(language: string) {
	const name = language.toLowerCase();

	if (name === "ansi") {
		return name;
	}

	if (name in languages) {
		return name as keyof typeof languages;
	}

	return aliases[name] ?? null;
}

// One highlighted token. Render it as a `<span>` with this style and class.
export type HighlightedToken = {
	content: string;
	style?: string;
	class?: string;
};

// A line of plain text, or the highlighted tokens of a line.
export type HighlightedLine = string | HighlightedToken[];

function toHighlightedLine(tokens: ThemedToken[]): HighlightedToken[] {
	return tokens.map((token) => ({
		content: token.content,
		style: stringifyTokenStyle(getTokenStyleObject(token)),
	}));
}

export type Highlighter = NonNullable<Awaited<ReturnType<typeof loadHighlighter>>>;

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
	const lang = getLanguage(language);

	if (!lang) {
		return null;
	}

	const shiki = await getHighlighter();

	if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
		await shiki.loadLanguage(languages[lang]);
	}

	return {
		// Returns the tokens of each line, and the grammar state after the last
		// line. Pass that state back to continue where the code left off.
		highlight(code: string, state?: GrammarState) {
			const tokenize = (text: string) =>
				shiki.codeToTokens(text, {
					lang,
					theme: "meadow",
					grammarState: state,
				}).tokens;

			// ANSI has no grammar state, so each line is tokenized on its own and
			// gets the same colors whether it arrives in one piece or streams.
			const tokens =
				lang === "ansi" ? code.split("\n").flatMap((line) => tokenize(line)) : tokenize(code);

			return {
				lines: tokens.map((line) => toHighlightedLine(line)),
				state: shiki.getLastGrammarState(tokens),
			};
		},
	};
}

// Returns the tokens of each line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
	const highlighter = await loadHighlighter(language);

	return highlighter ? highlighter.highlight(code).lines : null;
}
