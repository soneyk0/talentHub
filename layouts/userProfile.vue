<template>
	<NuxtLayout name="default">
		<template #default>
			<nav class="flex">
				<NuxtLink
					v-for="tab in tabs"
					:key="tab.path"
					:to="`/users/${id}${tab.path}`"
					:class="getTabClass(tab.path)"
				>
					{{ tab.label }}
				</NuxtLink>
			</nav>

			<div class="mt-8">
				<KeepAlive>
					<NuxtPage></NuxtPage>
				</KeepAlive>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup>
	import { useRoute } from 'vue-router';

	const route = useRoute();
	const id = ref(route.params.id);

	watch(
		() => route.params.id,
		(newParams) => {
			id.value = newParams;
		},
		{ deep: true }
	);
	const { t } = useI18n();
	const tabs = [
		{ path: '/profile', label: t('PROFILE') },
		{ path: '/skills', label: t('SKILLS') },
		{ path: '/languages', label: t('LANGUAGES') },
	];

	const tabClass =
		'p-2 text-sm no-underline w-36 h-11 text-center border-b-2 border-solid transition-all duration-200  active:bg-red-500/10';
	const activeTabClass = 'text-red-600 border-red-600 ';
	const inactiveTabClass = 'text-white border-transparent';

	const getTabClass = (tab) => {
		return route.path.endsWith(tab)
			? `${tabClass} ${activeTabClass} `
			: `${tabClass} ${inactiveTabClass}`;
	};
</script>
