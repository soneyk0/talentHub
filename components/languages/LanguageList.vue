<template>
	<div class="flex flex-col gap-8 pb-5">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<ButtonsLanguageButton
				v-for="language in languages"
				:key="language.name"
				:level="language.proficiency"
				:class="getLanguageButtonProps(language).class"
				:level-prop-class="getLanguageButtonProps(language).class"
				variant="text"
				color="secondary"
				:disabled="!canEdit"
				@click="$emit('languageClick', language)"
			>
				{{ language.name }}
			</ButtonsLanguageButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Language } from '~/global';

	const props = defineProps({
		languages: {
			type: Array as PropType<Language[]>,
			required: true,
		},
		isRemovalMode: {
			type: Boolean,
			default: false,
		},
		selectedLanguagesToRemove: {
			type: Object as PropType<Set<string>>,
			required: true,
		},
		canEdit: {
			type: Boolean,
			default: false,
		},
	});

	defineEmits(['languageClick']);

	// button ui helper
	const getLanguageButtonProps = (language: Language) => {
		if (props.isRemovalMode) {
			const isSelected = props.selectedLanguagesToRemove.has(language.name);
			return {
				class: isSelected ? 'text-white' : '',
			};
		}
		return {
			class: '',
		};
	};
</script>
