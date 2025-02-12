const currentUserId = ref<string | null>(null);

export function useCurrentUser() {
	const nuxtApp = useNuxtApp();

	const getCurrentUserId = computed(() => currentUserId.value);

	const setCurrentUserId = (id: string | null) => {
		currentUserId.value = id;
	};

	const reinitializeUser = () => {
		nuxtApp.$initializeUser();
	};

	return {
		getCurrentUserId,
		setCurrentUserId,
		reinitializeUser,
	};
}
