import graphqlLoader from 'vite-plugin-graphql-loader';

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxt/test-utils/module',
		'@samk-dev/nuxt-vcalendar',
		'@nuxtjs/color-mode',
		'@nuxtjs/i18n',
	],
	css: ['~/assets/styles/main.css'],
	plugins: [
		'~/plugins/apollo-client',
		'~/plugins/auth',
		{ src: '~/plugins/toast', mode: 'client' },
	],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	vite: {
		plugins: [graphqlLoader()],
	},
	colorMode: {
		classSuffix: '',
		preference: 'dark',
		fallback: 'dark',
	},
	i18n: {
		lazy: true,
		langDir: './locales',
		locales: [
			{ code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
			{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
		],
		defaultLocale: 'en',
		strategy: 'no_prefix',
		detectBrowserLanguage: {
			useCookie: true,
			fallbackLocale: 'en',
		},
	},
});
