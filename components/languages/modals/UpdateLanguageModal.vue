<template>
	<ModalsEntityModal
		:is-open="isOpen"
		:name-option="{
			value: selectedLanguage?.name ?? '',
			label: selectedLanguage?.name ?? '',
		}"
		:level-option="{
			value: selectedLevel ?? '',
			label: selectedLevel ?? '',
		}"
		:title="$t('update language')"
		confirm-text="CONFIRM"
		:has-changes="selectedLevel !== initialLevel"
		:entity-label="$t('Language')"
		:entity-level-label="$t('Language proficiency')"
		name-input-id="language-name"
		level-input-id="language-level"
		:name-options="[
			{
				value: selectedLanguage?.name ?? '',
				label: selectedLanguage?.name ?? '',
			},
		]"
		:level-options="languageLevels"
		:is-name-disabled="true"
		@update:is-open="$emit('update:isOpen', $event)"
		@update:level-option="handleLevelUpdate"
		@confirm="$emit('confirm')"
	/>
</template>

<script setup lang="ts">
	import type { Language } from '~/global';

	const props = defineProps({
		isOpen: {
			type: Boolean,
			required: true,
		},
		selectedLanguage: {
			type: Object as PropType<Language | null>,
			default: null,
		},
		selectedLevel: {
			type: String as PropType<Language['proficiency'] | null>,
			default: null,
		},
		initialLevel: {
			type: String as PropType<Language['proficiency'] | null>,
			default: null,
		},
		languageLevels: {
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
		emit('update:selectedLevel', option.value as Language['proficiency']);
	};
</script>
