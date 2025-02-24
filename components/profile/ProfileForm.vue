<template>
	<form
		class="grid w-full max-w-3xl grid-cols-1 gap-x-8 gap-y-9 px-4 md:grid-cols-2 md:pr-12"
		@submit.prevent="handleSubmit"
	>
		<BaseInput
			id="firstName"
			v-model="firstName"
			:label="$t('First Name')"
			:disabled="!canEdit"
		/>
		<BaseInput
			id="lastName"
			v-model="lastName"
			:label="$t('Last Name')"
			:disabled="!canEdit"
		/>

		<BaseDropdown
			id="department"
			v-model="selectedDepartment"
			:label="$t('Department')"
			:options="departments"
			:default-option-label="$t('No department')"
			:disabled="!canEdit"
		/>
		<BaseDropdown
			id="position"
			v-model="selectedPosition"
			:label="$t('Position')"
			:options="positions"
			:default-option-label="$t('No position')"
			:disabled="!canEdit"
		/>

		<div></div>
		<BaseButton
			v-if="canEdit"
			type="submit"
			variant="contained"
			color="primary"
			:disabled="isSubmitting || isUploading || !hasChanges"
		>
			{{ $t('Update') }}
		</BaseButton>
	</form>
</template>

<script setup lang="ts">
	import type { Option } from '~/global';

	const props = defineProps<{
		firstName: string;
		lastName: string;
		selectedDepartment: Option;
		selectedPosition: Option;
		departments: Option[];
		positions: Option[];
		canEdit: boolean;
		isSubmitting: boolean;
		isUploading: boolean;
		hasChanges: boolean;
	}>();

	const emit = defineEmits<{
		'update:firstName': [value: string];
		'update:lastName': [value: string];
		'update:selectedDepartment': [value: Option];
		'update:selectedPosition': [value: Option];
		submit: [];
	}>();

	const firstName = computed({
		get: () => props.firstName,
		set: (value) => emit('update:firstName', value),
	});

	const lastName = computed({
		get: () => props.lastName,
		set: (value) => emit('update:lastName', value),
	});

	const selectedDepartment = computed({
		get: () => props.selectedDepartment,
		set: (value) => emit('update:selectedDepartment', value),
	});

	const selectedPosition = computed({
		get: () => props.selectedPosition,
		set: (value) => emit('update:selectedPosition', value),
	});

	const handleSubmit = () => {
		emit('submit');
	};
</script>
