import { getUserById } from '~/services/user';

const currentUserId = ref<string | null>(null);
const hasLoaded = ref(false);

const userData = reactive({
	photo: '',
	firstName: '',
	lastName: '',
	email: '',
	profileLink: '',
});

export function useCurrentUser() {
	const nuxtApp = useNuxtApp();

	const getCurrentUserId = computed(() => {
		return currentUserId.value;
	});

	const setCurrentUserId = (id: string | null) => {
		currentUserId.value = id;
	};

	const fetchUserData = async () => {
		if (hasLoaded.value) {
			return;
		}
		try {
			const { user } = await getUserById(currentUserId.value!);
			if (user) {
				userData.photo = user.profile.avatar || '';
				userData.firstName = user.profile.first_name || '';
				userData.lastName = user.profile.last_name || '';
				userData.email = user.email || '';
				userData.profileLink = `/users/${currentUserId.value}/profile`;
				hasLoaded.value = true;
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const updateCurrentUserData = (user: any) => {
		if (user) {
			userData.photo = user.profile.avatar || '';
			userData.firstName = user.profile.first_name || '';
			userData.lastName = user.profile.last_name || '';
			userData.email = user.email || '';
			userData.profileLink = `/users/${currentUserId.value}/profile`;
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
		nuxtApp.$initializeUser();
	};

	return {
		getCurrentUserId,
		setCurrentUserId,
		reinitializeUser,
		fetchUserData,
		userData,
		updateCurrentUserData,
		clearUserData,
	};
}
