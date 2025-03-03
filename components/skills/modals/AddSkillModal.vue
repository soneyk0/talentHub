<template>
	<ModalsEntityModal
		:is-open="isOpen"
		:name-option="{
			value: selectedSkill?.id ?? '',
			label: selectedSkill?.name ?? '',
		}"
		:level-option="{
			value: selectedLevel ?? '',
			label: selectedLevel ?? '',
		}"
		:title="$t('Add skill')"
		:confirm-text="$t('Add')"
		:has-changes="!!(selectedSkill && selectedLevel)"
		:entity-label="$t('Skill')"
		:entity-level-label="$t('Skill mastery')"
		name-input-id="new-skill-name"
		level-input-id="new-skill-level"
		:name-options="skillOptions"
		:level-options="skillLevels"
		@update:is-open="$emit('update:isOpen', $event)"
		@update:name-option="handleNameUpdate"
		@update:level-option="handleLevelUpdate"
		@confirm="$emit('confirm')"
	/>
</template>

<script setup lang="ts">
	import type { SkillLevel } from '~/global';

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

	const props = defineProps({
		isOpen: {
			type: Boolean,
			required: true,
		},
		selectedSkill: {
			type: Object as PropType<SkillDefault | null>,
			default: null,
		},
		selectedLevel: {
			type: String as PropType<SkillLevel | null>,
			default: null,
		},
		skillOptions: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
		skillLevels: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
	});

	const emit = defineEmits([
		'update:isOpen',
		'update:selectedSkill',
		'update:selectedLevel',
		'confirm',
	]);

	const handleNameUpdate = (option: { value: string; label: string }) => {
		emit('update:selectedSkill', {
			id: option.value,
			name: option.label,
		} as SkillDefault);
	};

	const handleLevelUpdate = (option: { value: string; label: string }) => {
		emit('update:selectedLevel', option.value as SkillLevel);
	};
</script>
