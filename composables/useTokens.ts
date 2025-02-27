const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);

export function useTokens() {
	const setTokens = (newAccessToken: string, newRefreshToken: string) => {
		accessToken.value = newAccessToken;
		refreshToken.value = newRefreshToken;
	};

	const getAccessToken = computed(() => accessToken.value);
	const getRefreshToken = computed(() => refreshToken.value);

	return {
		setTokens,
		getAccessToken,
		getRefreshToken,
	};
}
