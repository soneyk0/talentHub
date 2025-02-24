<template>
	<div class="mx-auto max-w-4xl">
		<div class="mb-10">
			<BaseInput id="name" v-model="name" label="Name" type="text" />
		</div>
		<div class="mb-10">
			<BaseInput
				id="education"
				v-model="education"
				label="Education"
				type="text"
			/>
		</div>
		<div class="mb-10">
			<BaseTextarea
				id="description"
				v-model="description"
				label="Description"
				:rows="6"
				:disabled="false"
			/>
		</div>
		<div class="flex justify-end">
			<BaseButton
				type="button"
				variant="contained"
				color="primary"
				class="max-w-md"
				:disabled="!hasChanges"
				@click="handleSubmit"
			>
				UPDATE
			</BaseButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getCvById, updateCv } from '~/services/cv';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	definePageMeta({
		layout: 'cv',
	});

	const route = useRoute();
	const cvId = ref(route.params.id as string);
	const isSubmitting = ref(false);
	const cvDataKey = `cv-${cvId.value}`;
	const refreshCv = ref();

	const initialValues = ref({
		name: '',
		education: '',
		description: '',
	});

	const name = ref('');
	const education = ref('');
	const description = ref('');

	const hasChanges = computed(() => {
		return (
			name.value !== initialValues.value.name ||
			education.value !== initialValues.value.education ||
			description.value !== initialValues.value.description
		);
	});

	const { data: cvData } = useNuxtData(cvDataKey);

	if (!cvData.value) {
		const { data, refresh } = await useAsyncData(
			cvDataKey,
			() => getCvById(cvId.value as string),
			{
				server: true,
				lazy: false,
				immediate: true,
			}
		);
		cvData.value = data.value;
		refreshCv.value = refresh;
	}

	const handleSubmit = async () => {
		isSubmitting.value = true;
		try {
			const { executeUpdate: updateCvData } = updateCv({
				cvId: cvId.value,
				name: name.value,
				education: education.value,
				description: description.value,
			});
			await updateCvData();
			clearNuxtData(cvDataKey);

			const { data } = await useAsyncData(cvDataKey, () =>
				getCvById(cvId.value, true)
			);
			if (data.value?.cv) {
				name.value = data.value.cv.name || '';
				education.value = data.value.cv.education || '';
				description.value = data.value.cv.description || '';

				initialValues.value = {
					name: name.value,
					education: education.value,
					description: description.value,
				};
			}

			showSuccessToast('CV updated successfully');
		} catch (error) {
			showErrorToast('Failed to update CV');
		} finally {
			isSubmitting.value = false;
		}
	};

	watch(
		() => cvData.value?.cv,
		(newCv) => {
			if (newCv) {
				name.value = newCv.name || '';
				education.value = newCv.education || '';
				description.value = newCv.description || '';
				initialValues.value = {
					name: name.value,
					education: education.value,
					description: description.value,
				};
			}
		},
		{ immediate: true }
	);
</script>
