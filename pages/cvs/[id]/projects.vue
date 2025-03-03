<template>
	<div class="h-[calc(100vh-3rem-90px)]">
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
					@click="onAddProjectClick"
				>
					<div class="flex items-center justify-center gap-3">
						<PlusIcon color="var(--color-red-1)" width="24" />
						{{ $t('ADD PROJECT') }}
					</div>
				</BaseButton>
			</div>
		</div>
		<div>
			<Table
				:search-query="searchQuery"
				:headers="headers"
				:rows-data="filteredData"
				row-component="TableProjectRow"
				class="pb-24"
				@on-delete-project="openDeleteProjectModal"
				@on-edit-project="onUpdateProjectClick"
			/>
		</div>
		<CvProjectModal
			v-if="cvProjectModalOpened"
			v-model:is-open="cvProjectModalOpened"
			:project-list="listOfProjectsData"
			:project="selectedProject"
			:cv-id="cvId"
			@update:is-open="cvProjectModalOpened = $event"
			@project-updated="refreshCvProjects"
		></CvProjectModal>
		<BaseModal
			v-model:is-open="isDeleteProjectModalOpen"
			:confirm-text="$t('CONFIRM')"
			:cancel-text="$t('CANCEL')"
			:title="$t('Remove project')"
			:has-changes="isDeleteProjectModalOpen"
			@confirm="deleteProject"
			@cancel="projectForDelete = null"
		>
			<p class="text-white">
				{{ $t('Are you sure you want to delete project') }}
				<b>{{ projectForDelete!.name }}</b>
				?
			</p>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
	import '@vuepic/vue-datepicker/dist/main.css';
	import type { CvProject } from 'cv-graphql';
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import CvProjectModal from '~/components/modals/CvProjectModal.vue';
	import { getCvProjects, removeCvProject } from '~/services/cv';
	import { getAllProjects } from '~/services/projects';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	definePageMeta({
		layout: 'cv',
	});

	const searchQuery = ref('');
	const projects = ref<CvProject[]>([]);
	const cvProjectModalOpened = ref(false);
	const route = useRoute();
	const isDeleteProjectModalOpen = ref(false);
	const projectForDelete = ref<CvProject | null>(null);
	const cvId = ref(route.params.id as string);
	const { data: listOfProjectsData } = useNuxtData('listOfProjects');
	const selectedProject = ref<CvProject | null>(null);
	const { t } = useI18n();

	if (!listOfProjectsData.value) {
		const { data } = await useAsyncData(
			'listOfProjects',
			() => getAllProjects(),
			{
				server: true,
				lazy: false,
			}
		);
		listOfProjectsData.value = data.value;
	}

	const projectsDataKey = `project-${cvId.value}`;
	const { data: projectsData } = useNuxtData(projectsDataKey);
	const { data } = await useAsyncData(projectsDataKey, () =>
		getCvProjects(cvId.value)
	);
	projectsData.value = data.value;

	const headers = reactive([
		{ key: 'name', label: t('Name'), isSortable: true },
		{ key: 'domain', label: t('Domain'), isSortable: true },
		{ key: 'start_date', label: t('Start Date'), isSortable: true },
		{ key: 'end_date', label: t('End Date'), isSortable: true },
		{ key: 'link', label: '', isSortable: false },
	]);

	const tableData = computed(() => {
		return projects.value
			? projects.value.map((project) => ({
					id: +project.project.id,
					name: project.name,
					domain: project.domain,
					description: project.description,
					environment: project.environment,
					responsibilities: project.responsibilities || '',
					end_date: project.end_date,
					start_date: project.start_date,
				}))
			: [];
	});

	const filteredData = computed(() => {
		if (!searchQuery.value || !tableData.value) return tableData.value;

		const lowerCaseSearch = searchQuery.value.toLowerCase();

		return tableData.value.filter((row) => {
			const nameMatches = row.name?.toLowerCase().includes(lowerCaseSearch);
			const domainMatches = row.domain?.toLowerCase().includes(lowerCaseSearch);
			return nameMatches || domainMatches;
		});
	});

	const onAddProjectClick = () => {
		cvProjectModalOpened.value = true;
	};

	const onUpdateProjectClick = (project: CvProject) => {
		selectedProject.value = project;
		cvProjectModalOpened.value = true;
	};

	const refreshCvProjects = async () => {
		await useAsyncData(projectsDataKey, () => getCvProjects(cvId.value));
	};

	const openDeleteProjectModal = (project: CvProject) => {
		projectForDelete.value = project;
		isDeleteProjectModalOpen.value = true;
	};

	const deleteProject = async () => {
		try {
			const data = await removeCvProject(
				cvId.value,
				projectForDelete.value!.id.toString()
			);
			projectForDelete.value = null;
			await refreshCvProjects();
			showSuccessToast('Project deleted successfully');
			isDeleteProjectModalOpen.value = false;
		} catch (error) {
			showErrorToast('Error deleting Project');
			isDeleteProjectModalOpen.value = false;
		}
	};

	watch(
		() => cvProjectModalOpened.value,
		(value) => {
			if (!value) {
				selectedProject.value = null;
			}
		}
	);

	watch(
		() => projectsData.value,
		(newProject) => {
			if (newProject) {
				projects.value = newProject;
			}
		},
		{ immediate: true, deep: true }
	);
</script>
