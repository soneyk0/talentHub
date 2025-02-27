<template>
	<aside
		:class="[
			'flex flex-col gap-3 transition-all duration-300',
			isCollapsed ? 'w-14' : 'w-48',
		]"
	>
		<nav class="flex flex-col gap-3">
			<SidebarItem
				v-for="item in items"
				:key="item.text"
				:item="item"
				:is-collapsed="isCollapsed"
			/>
		</nav>
		<SidebarUserItem
			:item="displayUserInfo"
			:is-collapsed="isCollapsed"
			class="mt-auto"
			@logout="logout"
		/>

		<ButtonsToggle
			:is-toggled="isCollapsed"
			class="mb-4 ml-2"
			color="var(--color-white)"
			@click="toggleSidebar"
		/>
	</aside>
</template>

<script setup lang="ts">
	import { useRouter } from '#app';
	import IconsCVs from '~/components/icons/CVs.vue';
	import IconsEmployees from '~/components/icons/Employees.vue';
	import IconsLanguages from '~/components/icons/Languages.vue';
	import IconsSkills from '~/components/icons/Skills.vue';
	import { getUserById } from '~/services/user';
	const router = useRouter();
	const route = useRoute();
	const { t } = useI18n();
	const items = computed(() => [
		{
			icon: markRaw(IconsEmployees),
			text: t('Users'),
			link: '/users',
			isActive: route.path.startsWith('/users'),
		},
		{
			icon: markRaw(IconsSkills),
			text: t('Skills'),
			link: '/skills',
			isActive: route.path.startsWith('/skills'),
		},
		{
			icon: markRaw(IconsLanguages),
			text: t('Languages'),
			link: '/languages',
			isActive: route.path.startsWith('/languages'),
		},
		{
			icon: markRaw(IconsCVs),
			text: t('CVs'),
			link: '/cvs',
			isActive: route.path.startsWith('/cvs'),
		},
	]);

	const { getCurrentUserId, userData, updateCurrentUserData } =
		useCurrentUser();

	const userDataKey = `user-${getCurrentUserId.value}`;
	const { data: initialUserData } = useNuxtData(userDataKey);
	if (!initialUserData.value) {
		const { data, refresh } = await useAsyncData(
			userDataKey,
			() => getUserById(getCurrentUserId.value!, true),
			{
				server: true,
				lazy: false,
				immediate: true,
			}
		);
		initialUserData.value = data.value;
	}

	const displayUserInfo = computed(() => {
		if (userData.email) {
			return {
				photo: userData.photo,
				text:
					`${userData.firstName} ${userData.lastName}`.trim() || userData.email,
				link: userData.profileLink,
			};
		} else {
			return {
				photo: initialUserData.value.user.profile.avatar || '',
				text:
					`${initialUserData.value.user.profile.first_name || ''} ${initialUserData.value.user.profile.last_name || ''}`.trim() ||
					initialUserData.value.user.email,
				link: `/users/${getCurrentUserId.value}/profile`,
			};
		}
	});

	onMounted(async () => {
		if (initialUserData.value?.user) {
			updateCurrentUserData(initialUserData.value.user);
		}
	});

	const isCollapsed = ref(false);

	const toggleSidebar = () => {
		isCollapsed.value = !isCollapsed.value;
	};
	const logout = () => {
		const { clearUserData } = useCurrentUser();

		const accessToken = useCookie('access_token');
		const refreshToken = useCookie('refresh_token');
		accessToken.value = null;
		refreshToken.value = null;
		clearUserData();

		router.push('/auth/login');
	};

	const updateActiveTab = () => {
		items.value.forEach((item) => {
			item.isActive = route.path.startsWith(item.link);
		});
	};

	watch(
		() => route.path,
		() => {
			updateActiveTab();
		},
		{ immediate: true }
	);
</script>
