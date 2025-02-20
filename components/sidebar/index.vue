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
			v-if="displayUserInfo.text"
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

	const items = reactive([
		{
			icon: markRaw(IconsEmployees),
			text: 'Employees',
			link: '/users',
			isActive: true,
		},
		{
			icon: markRaw(IconsSkills),
			text: 'Skills',
			link: '/skills',
			isActive: false,
		},
		{
			icon: markRaw(IconsLanguages),
			text: 'Languages',
			link: '/languages',
			isActive: false,
		},
		{
			icon: markRaw(IconsCVs),
			text: 'CVs',
			link: '/cvs',
			isActive: false,
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
				text: `${userData.firstName} ${userData.lastName}`.trim(),
				link: userData.profileLink,
			};
		} else {
			return {
				photo: initialUserData.value.user.profile.avatar || '',
				text: `${initialUserData.value.user.profile.first_name || ''} ${initialUserData.value.user.profile.last_name || ''}`.trim(),
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
		items.forEach((item) => {
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
