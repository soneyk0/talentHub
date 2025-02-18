<template>
	<BaseModal
		v-model:is-open="isOpen"
		:title="title"
		:confirm-text="confirmText"
		:has-changes="hasChanges"
		@confirm="$emit('confirm')"
	>
		<BaseDropdown
			:id="nameInputId"
			v-model="nameOption"
			:label="entityLabel"
			:options="nameOptions"
			:disabled="isNameDisabled"
		/>
		<BaseDropdown
			:id="levelInputId"
			v-model="levelOption"
			:label="`${entityLabel} Level`"
			:options="levelOptions"
		/>
	</BaseModal>
</template>

<script setup lang="ts">
	const isOpen = defineModel<boolean>('isOpen', { default: false });
	const nameOption = defineModel<{ value: string; label: string }>(
		'nameOption'
	);
	const levelOption = defineModel<{ value: string; label: string }>(
		'levelOption'
	);

	interface Props {
		title: string;
		confirmText: string;
		hasChanges: boolean;
		entityLabel: string;
		nameInputId: string;
		levelInputId: string;
		nameOptions: Array<{
			value: string;
			label: string;
			disabled?: boolean;
			isSeparator?: boolean;
		}>;
		levelOptions: Array<{ value: string; label: string }>;
		isNameDisabled?: boolean;
	}

	defineProps<Props>();
	defineEmits<{
		(e: 'update:isOpen', value: boolean): void;
		(
			e: 'update:nameOption' | 'update:levelOption',
			value: { value: string; label: string }
		): void;
		(e: 'confirm'): void;
	}>();
</script>
