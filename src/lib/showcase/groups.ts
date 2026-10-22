/**
 * The components catalog. One entry per group page under /components; the
 * items are the components each page demonstrates, in page order.
 */
export type Group = {
	slug: string;
	title: string;
	/** One sentence, shown on the catalog index and the page intro. */
	description: string;
	items: string[];
};

export const groups: Group[] = [
	{
		slug: 'actions',
		title: 'Actions',
		description: 'Pill buttons in three sizes, grouped buttons, toggles, badges and keyboard keys.',
		items: ['Button', 'Button group', 'Toggle', 'Toggle group', 'Badge', 'Kbd']
	},
	{
		slug: 'forms',
		title: 'Forms',
		description: 'Text entry, choices, switches, sliders and dates, laid out with fields.',
		items: [
			'Input',
			'Textarea',
			'Label',
			'Field',
			'Form',
			'Input group',
			'Input OTP',
			'Native select',
			'Select',
			'Combobox',
			'Command',
			'Checkbox',
			'Radio group',
			'Switch',
			'Slider',
			'Calendar',
			'Range calendar',
			'Date picker'
		]
	},
	{
		slug: 'navigation',
		title: 'Navigation',
		description: 'Menus, tabs, breadcrumbs, pagination and the sidebar.',
		items: [
			'Tabs',
			'Breadcrumb',
			'Pagination',
			'Navigation menu',
			'Menubar',
			'Dropdown menu',
			'Context menu',
			'Sidebar'
		]
	},
	{
		slug: 'containment',
		title: 'Containment',
		description: 'Cards, lists, accordions and the surfaces that hold content.',
		items: [
			'Card',
			'Item',
			'Accordion',
			'Collapsible',
			'Separator',
			'Aspect ratio',
			'Scroll area',
			'Resizable',
			'Carousel',
			'Avatar',
			'Empty'
		]
	},
	{
		slug: 'overlays',
		title: 'Overlays & feedback',
		description: 'Dialogs, sheets, popovers and tooltips, plus alerts, progress and loading.',
		items: [
			'Dialog',
			'Alert dialog',
			'Sheet',
			'Drawer',
			'Popover',
			'Hover card',
			'Tooltip',
			'Sonner',
			'Alert',
			'Progress',
			'Skeleton',
			'Spinner'
		]
	},
	{
		slug: 'data',
		title: 'Data',
		description: 'Tables, sortable data tables and charts in the brand colours.',
		items: ['Table', 'Data table', 'Chart']
	},
	{
		slug: 'conversation',
		title: 'Conversation',
		description: 'Messages, attachments, code blocks and the pieces of a chat interface.',
		items: [
			'Message',
			'Message scroller',
			'Bubble',
			'Attachment',
			'Code block',
			'Marker',
			'Trace',
			'Questionnaire'
		]
	}
];

export function getGroup(slug: string): Group | undefined {
	return groups.find((g) => g.slug === slug);
}

export function neighbours(slug: string): { prev?: Group; next?: Group } {
	const i = groups.findIndex((g) => g.slug === slug);
	return { prev: groups[i - 1], next: groups[i + 1] };
}
