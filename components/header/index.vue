<template>
	<header class="flex items-center text-gray-1">
		<ol class="flex items-center">
			<HeaderItem
				v-for="(breadcrumb, index) in breadcrumbs"
				:key="index"
				:breadcrumb="breadcrumb"
				:index="index"
				:is-last="index === breadcrumbs.length - 1"
			/>
		</ol>
	</header>
</template>

<script setup lang="ts">
	import { getCvFullname } from '~/services/cv';
	import { getUserFullname } from '~/services/user';

	const route = useRoute();
	const router = useRouter();

	const id = ref('');
	const fullname = ref('');
	const { userData, getCurrentUserId } = useCurrentUser();

	const breadcrumbs = reactive<{ label: string; link: string }[]>([]);

	const getBreadcrumbs = (path: string) => {
		const pathSegments = path.split('/').filter(Boolean);

		const segments = pathSegments.map((segment, index) => {
			return {
				label:
					segment === 'users'
						? 'Employees'
						: segment.charAt(0).toUpperCase() + segment.slice(1),
				link: '/' + pathSegments.slice(0, index + 1).join('/'),
			};
		});

		if (
			fullname.value &&
			(pathSegments[0] === 'users' || pathSegments[0] === 'cvs') &&
			pathSegments[1]
		) {
			segments[1].label = fullname.value;
		}

		return segments;
	};

	const updateValues = async (path: string) => {
		const pathSegments: string[] = path.split('/').filter(Boolean);

		if (
			!(pathSegments[0] === 'users' || pathSegments[0] === 'cvs') ||
			!pathSegments[1]
		) {
			return;
		}

		if (id.value !== pathSegments[1]) {
			id.value = pathSegments[1];
			fullname.value = '';
		}

		let elemFullname = '';
		let elemEmail = '';

		switch (pathSegments[0]) {
			case 'users': {
				let userFullname = '';
				let userEmail = '';
				if (String(getCurrentUserId.value) === id.value) {
					userFullname = userData.firstName + ' ' + userData.lastName;
					userEmail = userData.email;
				} else {
					const { fullname, email } = await getUserFullname(id.value);
					userFullname = fullname;
					userEmail = email;
				}

				elemFullname = userFullname.trim();
				elemEmail = userEmail;
				break;
			}
			case 'cvs': {
				elemFullname = getCvFullname(id.value).fullname;
				break;
			}
			default: {
				return;
			}
		}

		if (elemFullname && elemFullname.trim() !== '') {
			fullname.value = elemFullname;
		} else if (pathSegments[0] === 'users' && elemEmail) {
			fullname.value = elemEmail;
		} else {
			fullname.value = id.value;
		}
	};

	router.afterEach((to) => {
		updateValues(to.path);
		breadcrumbs.length = 0;
		breadcrumbs.push(...getBreadcrumbs(to.path));
	});

	watchEffect(() => {
		if (import.meta.client) {
			updateValues(route.path);
			breadcrumbs.length = 0;
			breadcrumbs.push(...getBreadcrumbs(route.path));
		}
	});
</script>
