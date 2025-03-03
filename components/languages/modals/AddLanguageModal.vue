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
		:title="$t('add language')"
		confirm-text="ADD"
		:has-changes="!!(selectedLanguage && selectedLevel)"
		:entity-label="$t('Language')"
		:entity-level-label="$t('Language proficiency')"
		name-input-id="new-language-name"
		level-input-id="new-language-level"
		:name-options="languageOptions"
		:level-options="languageLevels"
		@update:is-open="$emit('update:isOpen', $event)"
		@update:name-option="handleNameUpdate"
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
		languageOptions: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
		languageLevels: {
			type: Array as PropType<{ value: string; label: string }[]>,
			required: true,
		},
	});

	const emit = defineEmits([
		'update:isOpen',
		'update:selectedLanguage',
		'update:selectedLevel',
		'confirm',
	]);

	const handleNameUpdate = (option: { value: string; label: string }) => {
		const language = { name: option.value } as Language;
		emit('update:selectedLanguage', language);
	};

	const handleLevelUpdate = (option: { value: string; label: string }) => {
		emit('update:selectedLevel', option.value as Language['proficiency']);
	};
</script>
