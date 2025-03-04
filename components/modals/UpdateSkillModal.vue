<template>
	<ModalsEntityModal
		:is-open="isOpen"
		:name-option="{
			value: selectedSkill?.name ?? '',
			label: selectedSkill?.name ?? '',
		}"
		:level-option="{
			value: selectedLevel ?? '',
			label: selectedLevel ?? '',
		}"
		:title="$t('Update skill')"
		:confirm-text="$t('Confirm')"
		:cancel-text="$t('Cancel')"
		:has-changes="selectedLevel !== initialLevel"
		:entity-label="$t('Skill')"
		:entity-level-label="$t('Skill mastery')"
		name-input-id="skill-name"
		level-input-id="skill-level"
		:name-options="[
			{
				value: selectedSkill?.name ?? '',
				label: selectedSkill?.name ?? '',
			},
		]"
		:level-options="skillLevels"
		:is-name-disabled="true"
		@update:is-open="$emit('update:isOpen', $event)"
		@update:level-option="handleLevelUpdate"
		@confirm="$emit('confirm')"
	/>
</template>

<script setup lang="ts">
	import type { Skill } from '~/global';

	const props = defineProps({
		isOpen: {
			type: Boolean,
			required: true,
		},
		selectedSkill: {
			type: Object as PropType<Skill | null>,
			default: null,
		},
		selectedLevel: {
			type: String as PropType<Skill['mastery'] | null>,
			default: null,
		},
		initialLevel: {
			type: String as PropType<Skill['mastery'] | null>,
			default: null,
		},
		skillLevels: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
	});

	const emit = defineEmits([
		'update:isOpen',
		'update:selectedLevel',
		'confirm',
	]);

	const handleLevelUpdate = (option: { value: string; label: string }) => {
		emit('update:selectedLevel', option.value as Skill['mastery']);
	};
</script>
