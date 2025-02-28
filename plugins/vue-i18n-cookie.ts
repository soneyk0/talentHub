export default defineNuxtPlugin({
	name: 'vue-i18n-cookie',
	dependsOn: ['i18n:plugin'],
	async setup(nuxtApp) {
		const i18n = nuxtApp.vueApp.$nuxt.$i18n;

		const localeCookie = useCookie('i18n_locale', {
			maxAge: 365 * 24 * 60 * 60,
			path: '/',
			sameSite: 'lax',
		});

		if (localeCookie.value) {
			await i18n.setLocale(localeCookie.value as 'en' | 'ru');
		} else {
			localeCookie.value = i18n.defaultLocale;
		}

		if (import.meta.client) {
			watch(
				() => i18n.locale.value,
				(newLocale) => {
					localeCookie.value = newLocale;
				}
			);
		}
	},
});
