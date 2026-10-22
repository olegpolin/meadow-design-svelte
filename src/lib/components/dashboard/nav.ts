import SunriseIcon from '@lucide/svelte/icons/sunrise';
import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
import TruckIcon from '@lucide/svelte/icons/truck';
import SproutIcon from '@lucide/svelte/icons/sprout';
import UsersIcon from '@lucide/svelte/icons/users';
import LandmarkIcon from '@lucide/svelte/icons/landmark';
import SettingsIcon from '@lucide/svelte/icons/settings';

export type NavItem = {
	title: string;
	href: string;
	icon: typeof SunriseIcon;
	/** Key of a live count shown as the menu badge. */
	count?: 'toPack' | 'stopsLeft';
};

export const shopNav: NavItem[] = [
	{ title: 'Today', href: '/dashboard', icon: SunriseIcon },
	{ title: 'Orders', href: '/dashboard/orders', icon: ShoppingBasketIcon, count: 'toPack' },
	{ title: 'Deliveries', href: '/dashboard/deliveries', icon: TruckIcon, count: 'stopsLeft' },
	{ title: 'Plants', href: '/dashboard/plants', icon: SproutIcon },
	{ title: 'Customers', href: '/dashboard/customers', icon: UsersIcon }
];

export const adminNav: NavItem[] = [
	{ title: 'Accounts', href: '/dashboard/accounts', icon: LandmarkIcon },
	{ title: 'Settings', href: '/dashboard/settings', icon: SettingsIcon }
];

export function isCurrent(pathname: string, href: string) {
	return href === '/dashboard' ? pathname === href || pathname === `${href}/` : pathname.startsWith(href);
}

export function pageTitle(pathname: string) {
	return [...shopNav, ...adminNav].find((item) => isCurrent(pathname, item.href))?.title ?? 'Today';
}
