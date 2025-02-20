import type { UserProfileInfo } from '~/global';
const currentUserId = ref<string | null>(null);
const hasLoaded = ref(false);

const userData = reactive({
	photo: '',
	firstName: '',
	lastName: '',
	email: '',
	profileLink: '',
	department: '',
	position: '',
});

export function useCurrentUser() {
	const nuxtApp = useNuxtApp();

	const getCurrentUserId = computed(() => {
		return currentUserId.value;
	});

	const setCurrentUserId = (id: string | null) => {
		currentUserId.value = id;
	};

	const updateCurrentUserData = (user: UserProfileInfo) => {
		if (user) {
			userData.photo = user.profile.avatar || '';
			userData.firstName = user.profile.first_name || '';
			userData.lastName = user.profile.last_name || '';
			userData.email = user.email || '';
			userData.profileLink = `/users/${currentUserId.value}/profile`;
			userData.department = user.department?.name || '';
			userData.position = user.position?.name || '';
			hasLoaded.value = true;
		}
	};

	const clearUserData = () => {
		currentUserId.value = null;
		userData.photo = '';
		userData.firstName = '';
		userData.lastName = '';
		userData.email = '';
		userData.profileLink = '';
		hasLoaded.value = false;
	};

	const reinitializeUser = () => {
		(nuxtApp.$initializeUser as () => Promise<void>)();
	};

	return {
		getCurrentUserId,
		setCurrentUserId,
		reinitializeUser,
		userData,
		updateCurrentUserData,
		clearUserData,
	};
}
