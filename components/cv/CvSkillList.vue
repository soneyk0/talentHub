<template>
	<div class="flex flex-col gap-8 pb-5">
		<div
			v-for="category in categories"
			:key="category.id"
			class="flex flex-col gap-4"
		>
			<h3 class="text-m font-light text-white">{{ category.name }}</h3>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<ButtonsProgressButton
					v-for="skill in getSkillsByCategory(category.id)"
					:key="skill.name"
					:progress="getSkillButtonProps(skill).progress"
					:class="getSkillButtonProps(skill).class"
					variant="text"
					color="secondary"
					:disabled="!canEdit"
					@click="$emit('skillClick', skill)"
				>
					{{ skill.name }}
				</ButtonsProgressButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { SKILL_LEVEL_TO_PROGRESS } from '~/constants/entity-level';
	import type { Category, Skill } from '~/global';

	const props = defineProps({
		categories: {
			type: Array as PropType<Category[]>,
			required: true,
		},
		skills: {
			type: Array as PropType<Skill[]>,
			required: true,
		},
		isRemovalMode: {
			type: Boolean,
			default: false,
		},
		selectedSkillsToRemove: {
			type: Object as PropType<Set<string>>,
			required: true,
		},
		canEdit: {
			type: Boolean,
			default: false,
		},
	});

	defineEmits(['skillClick']);

	const getSkillProgress = (mastery: Skill['mastery']) => {
		return SKILL_LEVEL_TO_PROGRESS[mastery];
	};

	const getSkillsByCategory = (categoryId: string) => {
		if (categoryId === 'other') {
			return props.skills.filter((skill) => !skill.categoryId);
		}
		return props.skills.filter((skill) => skill.categoryId === categoryId);
	};

	const getSkillButtonProps = (skill: Skill) => {
		if (props.isRemovalMode) {
			const isSelected = props.selectedSkillsToRemove.has(skill.name);
			return {
				progress: isSelected ? 0 : getSkillProgress(skill.mastery),
				class: isSelected ? 'text-white' : '',
			};
		}
		return {
			progress: getSkillProgress(skill.mastery),
			class: '',
		};
	};
</script>
