<template>
	<div class="-mt-8 flex h-[calc(100vh-70px-2.5rem)] flex-col">
		<div class="flex-1 overflow-y-auto pt-8">
			<div class="relative mx-auto flex w-full max-w-[900px] flex-col">
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
							@click="handleLanguageClick(language)"
						>
							{{ language.name }}
						</ButtonsLanguageButton>
					</div>
				</div>

				<div v-if="canEdit" class="sticky bottom-0 bg-dark-1 py-2">
					<div class="flex justify-end gap-4 px-2">
						<template v-if="!isRemovalMode">
							<BaseButton
								class="max-w-[220px]"
								variant="text"
								color="secondary"
								@click="handleAddLanguage"
							>
								<div class="flex items-center justify-center gap-3">
									<PlusIcon color="var(--color-gray-7)" width="24" />
									{{ $t('ADD LANGUAGE') }}
								</div>
							</BaseButton>
							<BaseButton
								v-if="languages.length > 0"
								class="max-w-[220px]"
								variant="text"
								color="primary"
								@click="isRemovalMode = true"
							>
								<div class="flex items-center justify-center gap-3">
									<TrashBin color="var(--color-red-1)" width="24" />
									{{ $t('REMOVE LANGUAGES') }}
								</div>
							</BaseButton>
						</template>
						<template v-else>
							<BaseButton
								class="max-w-[220px]"
								variant="outlined"
								color="secondary"
								@click="handleCancelRemoval"
							>
								{{ $t('Cancel') }}
							</BaseButton>
							<BaseButton
								class="max-w-[220px]"
								variant="contained"
								color="primary"
								:disabled="
									selectedLanguagesToRemove.size === 0 || isDeletingLanguages
								"
								@click="handleDeleteLanguages"
							>
								<div class="flex items-center justify-center gap-3">
									{{ $t('Delete') }}
									<div class="w-2">{{ selectedLanguagesToRemove.size }}</div>
								</div>
							</BaseButton>
						</template>
					</div>
				</div>
			</div>
		</div>
		<EntityModal
			v-model:is-open="isUpdateLanguageModalOpen"
			v-model:name-option="selectedLanguageOption"
			v-model:level-option="selectedLevelOption"
			:title="$t('update language')"
			confirm-text="CONFIRM"
			:has-changes="hasChanges"
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
			:level-options="LANGUAGE_LEVELS"
			:is-name-disabled="true"
			@confirm="handleUpdateLanguageConfirm"
		/>
		<EntityModal
			v-model:is-open="isAddLanguageModalOpen"
			v-model:name-option="newLanguageOption"
			v-model:level-option="newLevelOption"
			:title="$t('add language')"
			confirm-text="ADD"
			:has-changes="!!(newSelectedLanguage && newSelectedLevel)"
			:entity-label="$t('Language')"
			:entity-level-label="$t('Language proficiency')"
			name-input-id="new-language-name"
			level-input-id="new-language-level"
			:name-options="languageOptions"
			:level-options="LANGUAGE_LEVELS"
			@confirm="handleAddLanguageConfirm"
		/>
	</div>
</template>

<script setup lang="ts">
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import TrashBin from '~/components/icons/TrashBin.vue';
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

	const newLanguageOption = computed({
		get: () => ({
			value: newSelectedLanguage.value?.name ?? '',
			label: newSelectedLanguage.value?.name ?? '',
		}),
		set: (option) => {
			newSelectedLanguage.value =
				allLanguages.value.find((language) => language.name === option.value) ??
				null;
		},
	});

	const newLevelOption = computed({
		get: () => ({
			value: newSelectedLevel.value ?? '',
			label: newSelectedLevel.value ?? '',
		}),
		set: (option) => {
			newSelectedLevel.value = option.value as Language['proficiency'];
		},
	});

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
	const hasChanges = computed(() => selectedLevel.value !== initialLevel.value);

	const selectedLanguageOption = computed({
		get: () => ({
			value: selectedLanguage.value?.name ?? '',
			label: selectedLanguage.value?.name ?? '',
		}),
		set: () => {},
	});

	const selectedLevelOption = computed({
		get: () => ({
			value: selectedLevel.value ?? '',
			label: selectedLevel.value ?? '',
		}),
		set: (option) => {
			selectedLevel.value = option.value as Language['proficiency'];
		},
	});

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

	// button ui helper
	const getLanguageButtonProps = (language: Language) => {
		if (isRemovalMode.value) {
			const isSelected = selectedLanguagesToRemove.value.has(language.name);
			return {
				class: isSelected ? 'text-white' : '',
			};
		}
		return {
			class: '',
		};
	};
</script>
