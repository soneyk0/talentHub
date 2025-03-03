<template>
	<div class="-mt-8 flex h-[calc(100vh-70px-2.5rem)] flex-col">
		<div class="flex-1 overflow-y-auto pt-8">
			<div class="relative mx-auto flex w-full max-w-[900px] flex-col">
				<LanguageList
					:languages="languages"
					:is-removal-mode="isRemovalMode"
					:selected-languages-to-remove="selectedLanguagesToRemove"
					:can-edit="canEdit"
					@language-click="handleLanguageClick"
				/>

				<LanguageActions
					v-if="canEdit"
					:languages="languages"
					:is-removal-mode="isRemovalMode"
					:selected-languages-to-remove="selectedLanguagesToRemove"
					:is-deleting-languages="isDeletingLanguages"
					@add-language="handleAddLanguage"
					@toggle-removal-mode="isRemovalMode = !isRemovalMode"
					@cancel-removal="handleCancelRemoval"
					@delete-languages="handleDeleteLanguages"
				/>
			</div>
		</div>
		<UpdateLanguageModal
			v-model:is-open="isUpdateLanguageModalOpen"
			v-model:selected-language="selectedLanguage"
			v-model:selected-level="selectedLevel"
			:initial-level="initialLevel"
			:language-levels="LANGUAGE_LEVELS"
			@confirm="handleUpdateLanguageConfirm"
		/>

		<AddLanguageModal
			v-model:is-open="isAddLanguageModalOpen"
			v-model:selected-language="newSelectedLanguage"
			v-model:selected-level="newSelectedLevel"
			:language-options="languageOptions"
			:language-levels="LANGUAGE_LEVELS"
			@confirm="handleAddLanguageConfirm"
		/>
	</div>
</template>

<script setup lang="ts">
	import LanguageActions from '~/components/languages/LanguageActions.vue';
	import LanguageList from '~/components/languages/LanguageList.vue';
	import AddLanguageModal from '~/components/languages/modals/AddLanguageModal.vue';
	import UpdateLanguageModal from '~/components/languages/modals/UpdateLanguageModal.vue';
	import { LANGUAGE_LEVELS } from '~/constants/entity-level';
	import type { Language } from '~/global';
	import {
		addProfileLanguage,
		deleteProfileLanguage,
		getAllLanguages,
		getProfileLanguages,
		updateProfileLanguage,
	} from '~/services/user';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	definePageMeta({
		layout: 'user-profile',
	});

	const route = useRoute();
	const { getCurrentUserId } = useCurrentUser();

	const languages = ref<Language[]>([]);
	const userId = ref(
		(route.params.id as string) || String(getCurrentUserId.value)
	);
	const canEdit = computed(() => {
		return String(getCurrentUserId.value) === userId.value;
	});

	// languages data
	const languagesDataKey = `languages-${userId.value}`;
	const allLanguagesDataKey = 'all-languages';
	const { data: languagesData } = useNuxtData(languagesDataKey);
	const { data: allLanguagesData } = useNuxtData(allLanguagesDataKey);
	const allLanguages = ref<Language[]>([]);

	if (!languagesData.value) {
		const { data } = await useAsyncData(languagesDataKey, () =>
			getProfileLanguages(userId.value)
		);
		languagesData.value = data.value;
	}

	if (!allLanguagesData.value) {
		const { data } = await useAsyncData(allLanguagesDataKey, () =>
			getAllLanguages()
		);
		allLanguagesData.value = data.value;
	}

	watch(
		() => languagesData.value?.languages,
		(newLanguages) => {
			if (newLanguages) {
				languages.value = newLanguages;
			}
		},
		{ immediate: true }
	);

	watch(
		() => allLanguagesData.value?.languages,
		(newLanguages) => {
			if (newLanguages) {
				allLanguages.value = newLanguages;
			}
		},
		{ immediate: true }
	);

	// add language modal state and logic
	const isAddLanguageModalOpen = ref(false);
	const newSelectedLanguage = ref<Language | null>(null);
	const newSelectedLevel = ref<Language['proficiency'] | null>(null);

	const languageOptions = computed(() => {
		const availableLanguages = allLanguages.value.filter(
			(language) =>
				!languages.value.some(
					(userLanguage) => userLanguage.name === language.name
				)
		);

		return availableLanguages.map((language) => ({
			value: language.name,
			label: language.name,
		}));
	});

	const handleAddLanguage = () => {
		newSelectedLanguage.value = null;
		newSelectedLevel.value = null;
		isAddLanguageModalOpen.value = true;
	};

	const handleAddLanguageConfirm = async () => {
		if (!newSelectedLanguage.value || !newSelectedLevel.value) return;

		const newLanguage = {
			name: newSelectedLanguage.value.name,
			proficiency: newSelectedLevel.value,
		};

		try {
			const { executeAdd } = addProfileLanguage({
				userId: userId.value,
				name: newSelectedLanguage.value.name,
				proficiency: newSelectedLevel.value,
			});

			await executeAdd();
			clearNuxtData(languagesDataKey);
			languages.value = [...languages.value, newLanguage];

			showSuccessToast('Language added successfully');
			isAddLanguageModalOpen.value = false;
		} catch (error) {
			showErrorToast('Error adding language');
			console.error('Error adding language:', error);
		}
	};

	// update language modal state and logic
	const isUpdateLanguageModalOpen = ref(false);
	const selectedLanguage = ref<Language | null>(null);
	const initialLevel = ref<Language['proficiency'] | null>(null);
	const selectedLevel = ref<Language['proficiency'] | null>(null);

	const handleUpdateLanguageConfirm = async () => {
		if (!selectedLanguage.value || !selectedLevel.value) return;

		try {
			const { executeUpdate } = updateProfileLanguage({
				userId: userId.value,
				name: selectedLanguage.value.name,
				proficiency: selectedLevel.value,
			});

			await executeUpdate();
			clearNuxtData(languagesDataKey);
			languages.value = languages.value.map((language) =>
				language.name === selectedLanguage.value?.name
					? { ...language, proficiency: selectedLevel.value! }
					: language
			);

			showSuccessToast('Language updated successfully');
		} catch (error) {
			showErrorToast('Error updating language');
			console.error('Error updating language:', error);
		}
	};

	// removal mode state and logic
	const isRemovalMode = ref(false);
	const isDeletingLanguages = ref(false);
	const selectedLanguagesToRemove = ref<Set<string>>(new Set());

	const handleCancelRemoval = () => {
		isRemovalMode.value = false;
		selectedLanguagesToRemove.value.clear();
	};

	const handleDeleteLanguages = async () => {
		isDeletingLanguages.value = true;
		try {
			const { executeDelete } = deleteProfileLanguage(
				userId.value,
				Array.from(selectedLanguagesToRemove.value)
			);
			await executeDelete();
			clearNuxtData(languagesDataKey);

			languages.value = languages.value.filter(
				(language) => !selectedLanguagesToRemove.value.has(language.name)
			);
			showSuccessToast('Languages deleted successfully');
			handleCancelRemoval();
		} catch (error) {
			showErrorToast('Error deleting languages');
			console.error('Error deleting languages:', error);
		} finally {
			isDeletingLanguages.value = false;
		}
	};

	// handler to manage update and removal
	const handleLanguageClick = (language: Language) => {
		if (isRemovalMode.value) {
			const languageName = language.name;
			if (selectedLanguagesToRemove.value.has(languageName)) {
				selectedLanguagesToRemove.value.delete(languageName);
			} else {
				selectedLanguagesToRemove.value.add(languageName);
			}
			return;
		}
		selectedLanguage.value = language;
		selectedLevel.value = language.proficiency;
		initialLevel.value = language.proficiency;

		isUpdateLanguageModalOpen.value = true;
	};
</script>
