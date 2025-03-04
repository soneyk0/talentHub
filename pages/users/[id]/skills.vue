<template>
	<div class="-mt-8 flex h-[calc(100vh-70px-2.5rem)] flex-col">
		<div class="flex-1 overflow-y-auto pt-8">
			<div class="relative mx-auto flex w-full max-w-[900px] flex-col">
				<SkillList
					:categories="categoriesWithSkills"
					:skills="skills"
					:is-removal-mode="isRemovalMode"
					:selected-skills-to-remove="selectedSkillsToRemove"
					:can-edit="canEdit"
					@skill-click="handleSkillClick"
				/>

				<SkillActions
					v-if="canEdit"
					:skills="skills"
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
	import AddSkillModal from '~/components/modals/AddSkillModal.vue';
	import UpdateSkillModal from '~/components/modals/UpdateSkillModal.vue';
	import SkillActions from '~/components/skills/SkillActions.vue';
	import SkillList from '~/components/skills/SkillList.vue';
	import { SKILL_LEVELS } from '~/constants/entity-level';
	import type { Skill, SkillLevel } from '~/global';
	import {
		addProfileSkill,
		deleteProfileSkill,
		getAllSkills,
		getProfileSkills,
		getSkillCategories,
		updateProfileSkill,
	} from '~/services/user';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	definePageMeta({
		layout: 'user-profile',
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
	const skills = ref<Skill[]>([]);
	const allSkills = ref<SkillDefault[]>([]);
	const route = useRoute();
	const { getCurrentUserId } = useCurrentUser();
	const userId = ref((route.params.id as string) || getCurrentUserId.value);
	const canEdit = computed(() => {
		return String(getCurrentUserId.value) === String(userId.value);
	});

	const categoriesWithSkills = computed(() => {
		const hasSkillsWithNullCategory = skills.value.some(
			(skill) => !skill.categoryId
		);
		const filtered = categories.value.filter((category) =>
			skills.value.some((skill) => skill.categoryId === category.id)
		);
		if (hasSkillsWithNullCategory) {
			filtered.push(otherCategory);
		}
		return filtered;
	});

	// skills and categories data, initial loading
	const skillsDataKey = `skills-${userId.value}`;
	const categoriesDataKey = 'skill-categories';
	const allSkillsDataKey = 'all-skills';
	const { data: skillsData } = useNuxtData(skillsDataKey);
	const { data: categoriesData } = useNuxtData(categoriesDataKey);
	const { data: allSkillsData } = useNuxtData(allSkillsDataKey);

	if (!skillsData.value) {
		const { data } = await useAsyncData(skillsDataKey, () =>
			getProfileSkills(userId.value!)
		);

		skillsData.value = data.value;
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
		() => skillsData.value?.skills,
		(newSkills) => {
			if (newSkills) {
				skills.value = newSkills;
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

	// add skill modal state and logic
	const isAddSkillModalOpen = ref(false);
	const newSelectedSkill = ref<SkillDefault | null>(null);
	const newSelectedLevel = ref<Skill['mastery'] | null>(null);

	const skillOptions = computed(() => {
		const availableSkills = allSkills.value.filter(
			(skill) =>
				!skills.value.some((userSkill) => userSkill.name === skill.name)
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

		return Object.entries(groupedSkills).flatMap(([category, skills]) => [
			{ value: category, label: category, disabled: true, isSeparator: true },
			...skills.map((skill) => ({
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
		const fullSkillData = allSkills.value.find(
			(skill) => skill.id === newSelectedSkill.value?.id
		);
		if (!fullSkillData || !fullSkillData.name || !fullSkillData.category?.id) {
			showErrorToast('Error: Skill data incomplete');
			return;
		}

		const newSkill = {
			name: fullSkillData.name,
			categoryId: fullSkillData.category.id,
			mastery: newSelectedLevel.value,
		};

		try {
			const { executeAdd } = addProfileSkill({
				userId: userId.value!,
				name: fullSkillData!.name,
				categoryId: fullSkillData!.category.id,
				mastery: newSelectedLevel.value as SkillLevel,
			});

			await executeAdd();
			clearNuxtData(skillsDataKey);
			skills.value = [...skills.value, newSkill];

			showSuccessToast('Skill added successfully');
			isAddSkillModalOpen.value = false;
		} catch (error) {
			showErrorToast('Error adding skill');
			console.error('Error adding skill:', error);
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
			const { executeUpdate } = updateProfileSkill({
				userId: userId.value!,
				name: selectedSkill.value.name,
				categoryId: selectedSkill.value.categoryId,
				mastery: selectedLevel.value as SkillLevel,
			});

			await executeUpdate();
			clearNuxtData(skillsDataKey);

			skills.value = skills.value.map((skill) =>
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
			const { executeDelete } = deleteProfileSkill(
				userId.value!,
				Array.from(selectedSkillsToRemove.value)
			);
			await executeDelete();
			clearNuxtData(skillsDataKey);

			skills.value = skills.value.filter(
				(skill) => !selectedSkillsToRemove.value.has(skill.name)
			);
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
