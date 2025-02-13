import { defineNuxtPlugin } from '#app';
import { useCurrentUser } from '~/composables/useCurrentUser';

export default defineNuxtPlugin({
	name: 'auth',
	enforce: 'post',
	async setup(nuxtApp) {
		const initializeUser = async () => {
			let accessToken: string | null = null;
			const { setCurrentUserId, clearUserData } = useCurrentUser();
			clearUserData();

			if (import.meta.server) {
				const cookies = parseCookies(
					nuxtApp.ssrContext?.event.node.req.headers.cookie || ''
				);
				accessToken = cookies['access_token'];
			} else {
				const accessTokenCookie = useCookie('access_token');
				accessToken = accessTokenCookie.value ?? null;
			}

			if (accessToken) {
				try {
					const payload = JSON.parse(atob(accessToken.split('.')[1]));
					setCurrentUserId(payload.sub);
				} catch (e) {
					console.error('Failed to decode token:', e);
				}
			}
		};

		function parseCookies(cookieString: string) {
			return cookieString
				.split(';')
				.reduce((cookies: Record<string, string>, cookie) => {
					const [name, value] = cookie.trim().split('=');
					if (name) cookies[name] = value;
					return cookies;
				}, {});
		}

		await initializeUser();

		return {
			provide: {
				initializeUser,
			},
		};
	},
});
