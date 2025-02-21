<template>
	<div class="h-[calc(100vh-0.75rem-90px)]">
		<div class="flex items-center justify-between">
			<div>
				<BaseSearchBar
					v-model="searchQuery"
					:placeholder="$t('Search')"
					class="mb-5"
				/>
			</div>
			<div>
				<BaseButton
					color="primary"
					type="button"
					variant="text"
					@click="handleAddCV"
				>
					<div class="flex items-center justify-center gap-3">
						<PlusIcon color="var(--color-red-1)" width="24" />
						{{ $t('CREATE CV') }}
					</div>
				</BaseButton>
			</div>
		</div>
		<div>
			<Table
				:search-query="searchQuery"
				:headers="headers"
				:rows-data="filteredData"
				row-component="TableCvRow"
				@on-delete-c-v="openDeleteCVModal"
			/>
		</div>
		<BaseModal
			v-model:is-open="isAddCVModalOpen"
			:confirm-text="$t('Create')"
			:cancel-text="$t('Cancel')"
			:title="$t('Create CV')"
			:has-changes="!!name && !!education && !!description"
			@confirm="handleAddCVConfirm"
		>
			<BaseInput id="name" v-model="name" type="text" :label="$t('Name')" />
			<BaseInput
				id="education"
				v-model="education"
				type="text"
				:label="$t('Education')"
			/>
			<BaseTextarea
				id="description"
				v-model="description"
				:label="$t('Description')"
				:rows="6"
			/>
		</BaseModal>
		<BaseModal
			v-model:is-open="isDeleteCVModalOpen"
			:confirm-text="$t('Confirm')"
			:cancel-text="$t('Cancel')"
			:title="$t('Delete CV')"
			:has-changes="isDeleteCVModalOpen"
			@confirm="deleteCV"
			@cancel="selectedCv = null"
		>
			<p class="text-white">
				{{ $t('Are you sure you want to delete CV') }}
				<b>{{ selectedCv!.name }}</b>
				?
			</p>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
	import { useRouter } from '#app';
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import type { Cv } from '~/global';
	import { createCv, deleteCv, getAllCvs } from '~/services/cv';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	const searchQuery = ref('');
	const cvs = ref<Cv[]>([]);
	const isAddCVModalOpen = ref(false);
	const name = ref('');
	const education = ref('');
	const description = ref('');
	const router = useRouter();
	const isSubmitting = ref(false);
	const isDeleteCVModalOpen = ref(false);
	const selectedCv = ref<Cv | null>(null);

	const { getCurrentUserId } = useCurrentUser();
	const { t } = useI18n();

	const userId = String(getCurrentUserId.value);

	const cvsDataKey = `cvs-${userId}`;
	const { data: cvsData } = useNuxtData(cvsDataKey);
	const { data } = await useAsyncData(cvsDataKey, () => getAllCvs());
	cvsData.value = data.value;
	const headers = reactive([
		{ key: 'name', label: t('CV Name'), isSortable: true },
		{ key: 'education', label: t('Education'), isSortable: true },
		{ key: 'email', label: t('Email'), isSortable: true },
		{ key: 'link', label: '', isSortable: false },
	]);

	const tableData = computed(() => {
		return cvs.value
			? cvs.value.map((cv) => ({
					id: +cv.id,
					name: cv.name,
					education: cv.education || '',
					description: cv.description || '',
					email: cv.user.email,
					link: `/cvs/${cv.id}/details`,
				}))
			: [];
	});

	const filteredData = computed(() => {
		if (!searchQuery.value || !tableData.value) return tableData.value;

		const lowerCaseSearch = searchQuery.value.toLowerCase();

		return tableData.value.filter((row) => {
			const nameMatches = row.name?.toLowerCase().includes(lowerCaseSearch);
			const emailMatches = row.email?.toLowerCase().includes(lowerCaseSearch);
			return nameMatches || emailMatches;
		});
	});

	const handleAddCV = () => {
		name.value = '';
		education.value = '';
		description.value = '';
		isAddCVModalOpen.value = true;
	};

	const handleAddCVConfirm = async () => {
		if (!name.value) return;
		isSubmitting.value = true;

		try {
			const newCv = await createCv({
				userId: userId,
				name: name.value,
				education: education.value,
				description: description.value,
			});

			if (!newCv?.id) throw new Error('Failed to create CV');
			clearNuxtData(cvsDataKey);

			cvs.value = data.value ?? [];

			isAddCVModalOpen.value = false;
			showSuccessToast('CV created successfully');
			router.push(`/cvs/${newCv.id}/details`);
		} catch (error) {
			showErrorToast('CV creation failed');
			console.error('Error creating CV:', error);
		} finally {
			isSubmitting.value = false;
		}
	};

	const openDeleteCVModal = (cv: Cv) => {
		selectedCv.value = cv;
		isDeleteCVModalOpen.value = true;
	};

	const deleteCV = async () => {
		try {
			await deleteCv(selectedCv.value!.id.toString());
			selectedCv.value = null;
			await useAsyncData(cvsDataKey, () => getAllCvs());
			showSuccessToast('CV deleted successfully');
			isDeleteCVModalOpen.value = false;
		} catch (error) {
			showErrorToast('Error deleting CV');
			isDeleteCVModalOpen.value = false;
		}
	};

	watch(
		() => cvsData.value,
		(newCvs) => {
			if (newCvs) {
				cvs.value = newCvs;
			}
		},
		{ immediate: true, deep: true }
	);
</script>
