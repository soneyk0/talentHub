<template>
	<BaseModal
		v-model:is-open="isOpened"
		:confirm-text="project ? 'UPDATE' : 'ADD'"
		cancel-text="CANCEL"
		:modal-width="900"
		:hide-by-confirm="false"
		:has-changes="
			project
				? currentProject.start_date !== project.start_date ||
					currentProject.end_date !== project.end_date ||
					currentProject.responsibilities[0] !== project.responsibilities[0]
				: !!currentProject.projectId
		"
		:title="(project ? 'Update' : 'Add') + ' project'"
		@update:is-open="emit('update:isOpen', $event)"
		@confirm="onSubmit"
	>
		<div class="grid grid-cols-2 gap-4">
			<BaseDropdown
				id="project"
				v-model="selectedProjectOption"
				label="Project"
				:options="optionList"
				:disabled="!!project?.id"
				default-option-label="No project"
			/>
			<BaseInput
				id="domain"
				v-model="projectOptions.domain"
				:disabled="true"
				type="text"
				label="Domain"
			/>
			<BaseCalendar v-model="currentProject.start_date" label="Start date" />
			<BaseCalendar v-model="currentProject.end_date!" label="End date" />
		</div>

		<BaseTextarea
			id="description"
			v-model="projectOptions.description"
			label="Description"
			:disabled="true"
			:rows="6"
		/>
		<BaseInput
			id="environment"
			:model-value="projectOptions.environment.toString()"
			:disabled="true"
			label="Environment"
			class="bg-gray-"
			:hide-input="true"
		>
			<template #inner-content>
				<div
					class="flex flex-wrap gap-1 border border-gray-6 bg-dark-1 p-3 text-white"
				>
					<div
						v-for="(env, key) in projectOptions.environment"
						:key="key"
						class="flex items-center justify-center gap-1 rounded-xl bg-gray-9 px-2 py-1"
					>
						<div class="text-sm" style="line-height: 0.5rem">
							{{ env }}
						</div>
						<div
							class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-6 pb-1 text-base"
						>
							<div class="text-gray-800">x</div>
						</div>
					</div>
				</div>
			</template>
		</BaseInput>
		<BaseInput
			id="responsibilities"
			v-model="currentProject.responsibilities![0]"
			placeholder=""
			label="Responsibilities"
			type="text"
		/>
	</BaseModal>
</template>

<script setup lang="ts">
	import type { AddCvProjectInput, CvProject, Project } from 'cv-graphql';
	import type { Option } from '~/global';
	import { createCvProjects, updateCvProject } from '~/services/cv';

	const props = defineProps<{
		projectList: Project[];
		isOpen: boolean;
		cvId: string;
		project: CvProject | null;
	}>();

	const isOpened = ref(props.isOpen);

	const optionList = computed<Option[]>(() => {
		return props.projectList.map(({ id, name }) => ({
			value: id,
			label: name,
		}));
	});

	const emit = defineEmits<{
		(e: 'update:isOpen', value: boolean): void;
		(e: 'project-updated'): void;
	}>();

	const currentProject = reactive<AddCvProjectInput>({
		projectId: props.project ? props.project.id : '',
		start_date: props.project ? props.project.start_date : '',
		roles: [],
		cvId: props.cvId,
		end_date: props.project ? props.project.end_date : '',
		responsibilities: props.project
			? [...props.project.responsibilities]
			: [''],
	});

	const projectOptions = reactive({
		domain: props.project ? props.project.domain : '',
		description: props.project ? props.project.description : '',
		environment: [''],
	});

	const selectedProjectOption = ref<Option>({ label: '', value: '' });

	const patchCVProjectValues = (project: Partial<Project>) => {
		currentProject.projectId = project.id || '';
		currentProject.end_date = project.end_date || '';
		currentProject.start_date = project.start_date || '';
		projectOptions.domain = project.domain || '';
		projectOptions.description = project.description || '';
		projectOptions.environment = project.environment ? project.environment : [];
	};

	const onSubmit = async () => {
		if (props.project) {
			await updateCvProject({
				...currentProject,
				start_date: new Date(currentProject.start_date).toISOString(),
				end_date: new Date(currentProject.end_date!).toISOString(),
			});
		} else {
			await createCvProjects({
				...currentProject,
				start_date: new Date(currentProject.start_date).toISOString(),
				end_date: new Date(currentProject.end_date!).toISOString(),
			});
		}
		emit('project-updated');
		emit('update:isOpen', false);
	};

	watch(
		() => props.isOpen,
		(newValue) => {
			isOpened.value = newValue;
		}
	);

	watch(
		() => selectedProjectOption.value,
		({ value }: Option) => {
			const selectedProject = props.projectList.find(({ id }) => id === value);
			patchCVProjectValues(selectedProject || {});
		}
	);

	onMounted(() => {
		if (props.project) {
			selectedProjectOption.value = {
				value: props.project.id.toString(),
				label: props.project.name,
			};
		}
	});
</script>

<style scoped></style>
