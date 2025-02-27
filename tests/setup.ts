import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import en from '~/i18n/locales/en.json';
import ru from '~/i18n/locales/ru.json';
const i18n = createI18n({
	locale: 'en',
	legacy: false,
	globalInjection: true,
	messages: {
		en: en,
		ru: ru,
	},
});
config.global.plugins = [i18n];

config.global.stubs = {
	RouterLink: {
		template: '<a :href="to" class="router-link"><slot /></a>',
		props: ['to', 'custom', 'activeClass', 'exactActiveClass'],
	},
	NuxtLink: {
		template: '<a :href="to" class="nuxt-link"><slot /></a>',
		props: ['to'],
	},
	NuxtPage: {
		template: '<div class="nuxt-page-stub"><slot /></div>',
	},
	NuxtLayout: {
		template: '<div class="nuxt-layout-stub"><slot /></div>',
	},
	Sidebar: {
		template: '<aside data-test="sidebar"><slot /></aside>',
	},
	Header: {
		template: '<header data-test="header"><slot /></header>',
	},
};

config.global.mocks = {
	$route: {
		path: '/',
		params: {},
	},
	$router: {
		push: () => {},
		replace: () => {},
	},
};
