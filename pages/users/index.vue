<template>
	<div class="h-[calc(100vh-0.75rem-90px)]">
		<div>
			<BaseSearchBar v-model="searchQuery" placeholder="Search" class="mb-5" />
		</div>
		<div>
			<Table
				:search-query="searchQuery"
				:headers="headers"
				:rows-data="filteredData"
				row-component="TableUserRow"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getAllUsers } from '~/services/user';

	interface User {
		id: string | number;
		profile: {
			avatar: string | null;
			first_name: string;
			last_name: string;
		};
		email: string;
		department: { name: string } | null;
		position: { name: string } | null;
	}

	const searchQuery = ref('');
	const isDataLoaded = ref(false);
	const users = ref<User[]>([]);
	const { getCurrentUserId } = useCurrentUser();
	const currentUserId = ref(Number(getCurrentUserId.value));

	const getUsers = async () => {
		try {
			const { users: data } = await getAllUsers();
			users.value = data;
		} catch (error) {
			console.error('Error loading users:', error);
		} finally {
			isDataLoaded.value = true;
		}
	};
	getUsers();

	const headers = reactive([
		{ key: 'avatar', label: '', isSortable: false },
		{ key: 'firstName', label: 'First Name', isSortable: true },
		{ key: 'lastName', label: 'Last Name', isSortable: true },
		{ key: 'email', label: 'Email', isSortable: true },
		{ key: 'department', label: 'Department', isSortable: true },
		{ key: 'position', label: 'Position', isSortable: true },
		{ key: 'link', label: '', isSortable: false },
	]);

	const tableData = computed(() => {
		if (!isDataLoaded.value) return [];
		return users.value.map((user) => ({
			id: Number(user.id),
			photo: user.profile.avatar || '',
			firstName: user.profile.first_name,
			lastName: user.profile.last_name,
			email: user.email,
			department: user.department?.name || 'N/A',
			position: user.position?.name || 'N/A',
			link: `/users/${user.id}/profile`,
		}));
	});

	const filteredData = computed(() => {
		if (!tableData.value) return [];
		let data = tableData.value;

		if (searchQuery.value) {
			const lowerCaseSearch = searchQuery.value.toLowerCase();
			data = data.filter((row) => {
				const firstNameMatches = row.firstName
					?.toLowerCase()
					.includes(lowerCaseSearch);
				const lastNameMatches = row.lastName
					?.toLowerCase()
					.includes(lowerCaseSearch);
				const emailMatches = row.email?.toLowerCase().includes(lowerCaseSearch);
				return firstNameMatches || lastNameMatches || emailMatches;
			});
		}
		return data.sort((a, b) => {
			if (a.id === currentUserId.value) return -1;
			if (b.id === currentUserId.value) return 1;
			return 0;
		});
	});

	onMounted(() => {
		if (import.meta.client) {
			getUsers();
		}
	});
</script>
