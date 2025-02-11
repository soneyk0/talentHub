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
							@click="handleLanguageClick(language)"
						>
							{{ language.name }}
						</ButtonsLanguageButton>
					</div>
				</div>

				<div class="sticky bottom-0 bg-dark-1 py-2">
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
									ADD LANGUAGE
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
									REMOVE LANGUAGES
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
								CANCEL
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
									DELETE
									<div class="w-2">{{ selectedLanguagesToRemove.size }}</div>
								</div>
							</BaseButton>
						</template>
					</div>
				</div>
			</div>
		</div>
		<BaseModal
			v-model:is-open="isUpdateLanguageModalOpen"
			title="Update Language"
			confirm-text="CONFIRM"
			:has-changes="hasChanges"
			@confirm="handleUpdateLanguageConfirm"
		>
			<BaseDropdown
				id="language-name"
				v-model="selectedLanguageOption"
				label="Language"
				:options="[
					{
						value: selectedLanguage?.name ?? '',
						label: selectedLanguage?.name ?? '',
					},
				]"
				disabled
			/>
			<BaseDropdown
				id="language-level"
				v-model="selectedLevelOption"
				label="Language Level"
				:options="languageLevelOptions"
			/>
		</BaseModal>
		<BaseModal
			v-model:is-open="isAddLanguageModalOpen"
			title="Add Language"
			confirm-text="ADD"
			:has-changes="!!(newSelectedLanguage && newSelectedLevel)"
			@confirm="handleAddLanguageConfirm"
		>
			<BaseDropdown
				id="new-language-name"
				v-model="newLanguageOption"
				label="Language"
				:options="languageOptions"
			/>
			<BaseDropdown
				id="new-language-level"
				v-model="newLevelOption"
				label="Language Level"
				:options="languageLevelOptions"
			/>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import TrashBin from '~/components/icons/TrashBin.vue';
	import {
		addProfileLanguage,
		deleteProfileLanguage,
		getAllLanguages,
		getProfileLanguages,
		updateProfileLanguage,
	} from '~/services/user';

	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	interface Language {
		name: string;
		proficiency: 'Native' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';
	}

	const languages = ref<Language[]>([]);

	const route = useRoute();
	const userId = ref((route.params.id as string) || '481');

	const languagesDataKey = `languages-${userId.value}`;
	const allLanguagesDataKey = 'all-languages';

	const { data: languagesData } = useNuxtData(languagesDataKey);
	const { data: allLanguagesData } = useNuxtData(allLanguagesDataKey);

	const isAddLanguageModalOpen = ref(false);
	const allLanguages = ref<Language[]>([]);
	const newSelectedLanguage = ref<Language | null>(null);
	const newSelectedLevel = ref<Language['proficiency'] | null>(null);

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

	const isUpdateLanguageModalOpen = ref(false);
	const selectedLanguage = ref<Language | null>(null);
	const selectedLanguageOption = computed({
		get: () => ({
			value: selectedLanguage.value?.name ?? '',
			label: selectedLanguage.value?.name ?? '',
		}),
		set: () => {},
	});

	const initialLevel = ref<Language['proficiency'] | null>(null);
	const selectedLevel = ref<Language['proficiency'] | null>(null);
	const selectedLevelOption = computed({
		get: () => ({
			value: selectedLevel.value ?? '',
			label: selectedLevel.value ?? '',
		}),
		set: (option) => {
			selectedLevel.value = option.value as Language['proficiency'];
		},
	});

	const languageLevelOptions = [
		{ value: 'Native', label: 'Native' },
		{ value: 'C2', label: 'C2' },
		{ value: 'C1', label: 'C1' },
		{ value: 'B2', label: 'B2' },
		{ value: 'B1', label: 'B1' },
		{ value: 'A2', label: 'A2' },
		{ value: 'A1', label: 'A1' },
	];

	const isRemovalMode = ref(false);
	const isDeletingLanguages = ref(false);
	const selectedLanguagesToRemove = ref<Set<string>>(new Set());

	const hasChanges = computed(() => selectedLevel.value !== initialLevel.value);

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
