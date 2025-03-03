<template>
	<div class="-mt-8 flex h-[calc(100vh-70px-2.5rem)] flex-col">
		<div class="flex-1 overflow-y-auto pt-8">
			<div class="relative mx-auto flex w-full max-w-[900px] flex-col">
				<CvSkillList
					:categories="categoriesWithSkills"
					:skills="cvSkills"
					:is-removal-mode="isRemovalMode"
					:selected-skills-to-remove="selectedSkillsToRemove"
					:can-edit="canEdit"
					@skill-click="handleSkillClick"
				/>

				<CvSkillActions
					v-if="canEdit"
					:skills="cvSkills"
					:is-removal-mode="isRemovalMode"
					:selected-skills-to-remove="selectedSkillsToRemove"
					:is-deleting-skills="isDeletingSkills"
					@add-skill="handleAddSkill"
					@toggle-removal-mode="isRemovalMode = !isRemovalMode"
					@cancel-removal="handleCancelRemoval"
					@delete-skills="handleDeleteSkills"
				/>
			</div>
		</div>
		<UpdateSkillModal
			v-model:is-open="isUpdateSkillModalOpen"
			v-model:selected-skill="selectedSkill"
			v-model:selected-level="selectedLevel"
			:initial-level="initialLevel"
			:skill-levels="SKILL_LEVELS"
			@confirm="handleUpdateSkillConfirm"
		/>
		<AddSkillModal
			v-model:is-open="isAddSkillModalOpen"
			v-model:selected-skill="newSelectedSkill"
			v-model:selected-level="newSelectedLevel"
			:skill-options="skillOptions"
			:skill-levels="SKILL_LEVELS"
			@confirm="handleAddSkillConfirm"
		/>
	</div>
</template>

<script setup lang="ts">
	import CvSkillList from '~/components/cv/CvSkillList.vue';
	import AddSkillModal from '~/components/modals/AddSkillModal.vue';
	import UpdateSkillModal from '~/components/modals/UpdateSkillModal.vue';
	import { SKILL_LEVELS } from '~/constants/entity-level';
	import type { Skill, SkillLevel } from '~/global';
	import {
		addCvSkill,
		deleteCvSkill,
		getCvSkills,
		updateCvSkill,
	} from '~/services/cv';
	import { getAllSkills, getSkillCategories } from '~/services/user';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	definePageMeta({
		layout: 'cv',
	});

	interface SkillDefault {
		id: string;
		name: string;
		category: {
			id: string;
			order: number;
		};
		category_name: string;
		category_parent_name: string;
	}

	interface SkillCategory {
		id: string;
		name: string;
		parent: {
			id: string;
			name: string;
		} | null;
	}

	const otherCategory = {
		id: 'other',
		name: 'Other',
		parent: null,
	} as const;

	const categories = ref<SkillCategory[]>([otherCategory]);
	const cvSkills = ref<Skill[]>([]);
	const allSkills = ref<SkillDefault[]>([]);
	const route = useRoute();
	const { getCurrentUserId } = useCurrentUser();
	const userId = ref(getCurrentUserId.value);
	const cvId = ref(route.params.id as string);
	const canEdit = computed(() => {
		return String(getCurrentUserId.value) === String(userId.value);
	});

	const categoriesWithSkills = computed(() => {
		const hasSkillsWithNullCategory = cvSkills.value.some(
			(skill) => !skill.categoryId
		);
		const filtered = categories.value.filter((category) =>
			cvSkills.value.some((skill) => skill.categoryId === category.id)
		);
		if (hasSkillsWithNullCategory) {
			filtered.push(otherCategory);
		}
		return filtered;
	});

	// skills and categories data, initial loading
	const skillsDataKey = `skills-${cvId.value}`;
	const categoriesDataKey = 'skill-categories';
	const allSkillsDataKey = 'all-skills';
	const { data: skillsData } = useNuxtData(skillsDataKey);
	const { data: categoriesData } = useNuxtData(categoriesDataKey);
	const { data: allSkillsData } = useNuxtData(allSkillsDataKey);

	if (!skillsData.value) {
		const { data } = await useAsyncData(skillsDataKey, () =>
			getCvSkills(cvId.value!)
		);
		skillsData.value = data.value;
		cvSkills.value = skillsData.value;
	}

	if (!categoriesData.value) {
		const { data } = await useAsyncData(categoriesDataKey, () =>
			getSkillCategories()
		);
		categoriesData.value = data.value;
	}

	if (!allSkillsData.value) {
		const { data } = await useAsyncData(allSkillsDataKey, () => getAllSkills());
		allSkillsData.value = data.value;
	}

	watch(
		() => categoriesData.value?.categories,
		(newCategories) => {
			if (newCategories) {
				categories.value = newCategories;
			}
		},
		{ immediate: true }
	);

	watch(
		() => allSkillsData.value?.skills,
		(newSkills) => {
			if (newSkills) {
				allSkills.value = newSkills;
			}
		},
		{ immediate: true }
	);

	watch(
		() => skillsData.value?.skills,
		(newSkills) => {
			if (newSkills) {
				cvSkills.value = newSkills;
			}
		},
		{ immediate: true }
	);

	// add skill modal state and logic
	const isAddSkillModalOpen = ref(false);
	const newSelectedSkill = ref<SkillDefault | null>(null);
	const newSelectedLevel = ref<Skill['mastery'] | null>(null);

	const skillOptions = computed(() => {
		const availableSkills = allSkills.value.filter(
			(skill) =>
				!cvSkills.value.some((userSkill) => userSkill.name === skill.name)
		);

		const groupedSkills = availableSkills.reduce(
			(acc, skill) => {
				const category = skill.category_name;
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(skill);
				return acc;
			},
			{} as Record<string, SkillDefault[]>
		);

		return Object.entries(groupedSkills).flatMap(([category, cvSkills]) => [
			{ value: category, label: category, disabled: true, isSeparator: true },
			...cvSkills.map((skill) => ({
				value: skill.id,
				label: skill.name,
			})),
		]);
	});

	const handleAddSkill = () => {
		newSelectedSkill.value = null;
		newSelectedLevel.value = null;
		isAddSkillModalOpen.value = true;
	};

	const handleAddSkillConfirm = async () => {
		if (!newSelectedSkill.value || !newSelectedLevel.value) return;
		try {
			const data = await addCvSkill({
				cvId: cvId.value!,
				name: newSelectedSkill.value.name,
				categoryId: newSelectedSkill.value.id,
				mastery: newSelectedLevel.value as SkillLevel,
			});
			clearNuxtData(skillsDataKey);
			cvSkills.value = data.skills;

			showSuccessToast('Skill added successfully');
			isAddSkillModalOpen.value = false;
		} catch (error) {
			showErrorToast('Error adding skill');
		}
	};

	// update skill modal state and logic
	const isUpdateSkillModalOpen = ref(false);
	const selectedSkill = ref<Skill | null>(null);
	const initialLevel = ref<Skill['mastery'] | null>(null);
	const selectedLevel = ref<Skill['mastery'] | null>(null);

	const handleUpdateSkillConfirm = async () => {
		if (!selectedSkill.value || !selectedLevel.value) return;

		try {
			const { executeUpdate } = updateCvSkill({
				cvId: cvId.value!,
				name: selectedSkill.value.name,
				categoryId: selectedSkill.value.categoryId,
				mastery: selectedLevel.value as SkillLevel,
			});

			await executeUpdate();
			clearNuxtData(skillsDataKey);

			cvSkills.value = cvSkills.value.map((skill) =>
				skill.name === selectedSkill.value?.name
					? { ...skill, mastery: selectedLevel.value! }
					: skill
			);

			showSuccessToast('Skill updated successfully');
		} catch (error) {
			showErrorToast('Error updating skill');
			console.error('Error updating skill:', error);
		}
	};

	// removal mode state and logic
	const isRemovalMode = ref(false);
	const isDeletingSkills = ref(false);
	const selectedSkillsToRemove = ref<Set<string>>(new Set());

	const handleCancelRemoval = () => {
		isRemovalMode.value = false;
		selectedSkillsToRemove.value.clear();
	};

	const handleDeleteSkills = async () => {
		isDeletingSkills.value = true;
		try {
			const { executeDelete } = deleteCvSkill(
				cvId.value!,
				Array.from(selectedSkillsToRemove.value)
			);
			const data = await executeDelete();
			clearNuxtData(skillsDataKey);
			cvSkills.value = data.skills;
			showSuccessToast('Skills deleted successfully');
			handleCancelRemoval();
		} catch (error) {
			showErrorToast('Error deleting skills');
			console.error('Error deleting skills:', error);
		} finally {
			isDeletingSkills.value = false;
		}
	};

	// handler to manage update and removal
	const handleSkillClick = (skill: Skill) => {
		if (isRemovalMode.value) {
			const skillName = skill.name;
			if (selectedSkillsToRemove.value.has(skillName)) {
				selectedSkillsToRemove.value.delete(skillName);
			} else {
				selectedSkillsToRemove.value.add(skillName);
			}
			return;
		}
		selectedSkill.value = skill;
		selectedLevel.value = skill.mastery;
		initialLevel.value = skill.mastery;

		isUpdateSkillModalOpen.value = true;
	};
</script>
