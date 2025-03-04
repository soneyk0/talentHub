import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import LanguagesPage from '~/pages/languages/index.vue';
import {
	addProfileLanguage,
	deleteProfileLanguage,
	getAllLanguages,
	getProfileLanguages,
	updateProfileLanguage,
} from '~/services/user';
import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

vi.mock('~/services/user', () => ({
	addProfileLanguage: vi.fn(),
	deleteProfileLanguage: vi.fn(),
	getAllLanguages: vi.fn(),
	getProfileLanguages: vi.fn(),
	updateProfileLanguage: vi.fn(),
}));

vi.mock('~/utils/toast/toast', () => ({
	showSuccessToast: vi.fn(),
	showErrorToast: vi.fn(),
}));

vi.mock('~/components/languages/LanguageList.vue', () => ({
	default: {
		name: 'LanguageList',
		props: [
			'languages',
			'isRemovalMode',
			'selectedLanguagesToRemove',
			'canEdit',
		],
		template:
			'<div data-testid="language-list">{{ languages.length }} languages</div>',
	},
}));

vi.mock('~/components/languages/LanguageActions.vue', () => ({
	default: {
		name: 'LanguageActions',
		props: [
			'languages',
			'isRemovalMode',
			'selectedLanguagesToRemove',
			'isDeletingLanguages',
		],
		template: '<div data-testid="language-actions"></div>',
	},
}));

vi.mock('~/components/languages/modals/UpdateLanguageModal.vue', () => ({
	default: {
		name: 'UpdateLanguageModal',
		props: [
			'isOpen',
			'selectedLanguage',
			'selectedLevel',
			'initialLevel',
			'languageLevels',
		],
		template: '<div data-testid="update-language-modal" v-if="isOpen"></div>',
	},
}));

vi.mock('~/components/languages/modals/AddLanguageModal.vue', () => ({
	default: {
		name: 'AddLanguageModal',
		props: [
			'isOpen',
			'selectedLanguage',
			'selectedLevel',
			'languageOptions',
			'languageLevels',
		],
		template: '<div data-testid="add-language-modal" v-if="isOpen"></div>',
	},
}));

mockNuxtImport('useRoute', () => {
	return () => ({
		params: { id: undefined },
	});
});

mockNuxtImport('useCurrentUser', () => {
	return () => ({
		getCurrentUserId: ref('test-user-id'),
	});
});

mockNuxtImport('clearNuxtData', () => {
	return vi.fn();
});

const mockLanguagesData = {
	languages: [
		{ name: 'English', proficiency: 'Native' },
		{ name: 'Spanish', proficiency: 'C1' },
		{ name: 'French', proficiency: 'B2' },
	],
};

const mockAllLanguagesData = {
	languages: [
		{ name: 'English', proficiency: null },
		{ name: 'Spanish', proficiency: null },
		{ name: 'French', proficiency: null },
		{ name: 'German', proficiency: null },
		{ name: 'Italian', proficiency: null },
		{ name: 'Japanese', proficiency: null },
	],
};

describe('Languages Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getProfileLanguages).mockResolvedValue({
			languages: mockLanguagesData.languages,
			error: null,
		});

		vi.mocked(getAllLanguages).mockResolvedValue({
			languages: mockAllLanguagesData.languages,
			error: null,
		});

		vi.mocked(addProfileLanguage).mockReturnValue({
			executeAdd: vi.fn().mockResolvedValue({
				languages: [
					...mockLanguagesData.languages,
					{ name: 'German', proficiency: 'B1' },
				],
				error: null,
			}),
			loading: ref(false),
			error: ref(null),
		});

		vi.mocked(updateProfileLanguage).mockReturnValue({
			executeUpdate: vi.fn().mockResolvedValue({
				languages: mockLanguagesData.languages.map((language) =>
					language.name === 'English'
						? { ...language, proficiency: 'C1' }
						: language
				),
				error: null,
			}),
			loading: ref(false),
			error: ref(null),
		});

		vi.mocked(deleteProfileLanguage).mockReturnValue({
			executeDelete: vi.fn().mockResolvedValue({
				languages: mockLanguagesData.languages.filter(
					(language) => language.name !== 'English'
				),
				error: null,
			}),
			loading: ref(false),
			error: ref(null),
		});

		mockNuxtImport('useNuxtData', () => {
			return (key: string) => {
				if (key === `languages-test-user-id`) {
					return { data: { value: null } };
				} else if (key === 'all-languages') {
					return { data: { value: null } };
				}
				return { data: { value: null } };
			};
		});

		mockNuxtImport('useAsyncData', () => {
			return async (key: string, fetcher: any) => {
				await fetcher();
				if (key === `languages-test-user-id`) {
					return {
						data: { value: { languages: mockLanguagesData.languages } },
						refresh: vi.fn(),
					};
				} else if (key === 'all-languages') {
					return {
						data: { value: { languages: mockAllLanguagesData.languages } },
						refresh: vi.fn(),
					};
				}
				const result = await fetcher();
				return { data: { value: result }, refresh: vi.fn() };
			};
		});
	});

	it('renders the languages page with language list', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		expect(wrapper.find('[data-testid="language-list"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="language-list"]').text()).toContain(
			'3 languages'
		);
	});

	it('renders language actions when user can edit', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		expect(wrapper.find('[data-testid="language-actions"]').exists()).toBe(
			true
		);
	});

	it('fetches profile languages using the correct user ID', async () => {
		vi.mocked(getProfileLanguages).mockClear();
		mockNuxtImport('useNuxtData', () => {
			return (key: string) => {
				return { data: { value: null } };
			};
		});
		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;

		expect(getProfileLanguages).toHaveBeenCalledWith('test-user-id');
	});

	it('fetches all available languages', async () => {
		await mountSuspended(LanguagesPage);

		expect(getAllLanguages).toHaveBeenCalled();
	});

	it('opens add language modal when handleAddLanguage is called', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		await vm.handleAddLanguage();

		expect(wrapper.find('[data-testid="add-language-modal"]').exists()).toBe(
			true
		);
	});

	it('adds a new language successfully', async () => {
		const mockExecuteAdd = vi.fn().mockResolvedValue({
			languages: [
				...mockLanguagesData.languages,
				{ name: 'German', proficiency: 'B1' },
			],
		});

		vi.mocked(addProfileLanguage).mockReturnValue({
			executeAdd: mockExecuteAdd,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.newSelectedLanguage.value = { name: 'German' };
		vm.newSelectedLevel.value = 'B1';

		await vm.handleAddLanguageConfirm();

		expect(addProfileLanguage).toHaveBeenCalledWith({
			userId: 'test-user-id',
			name: 'German',
			proficiency: 'B1',
		});

		expect(mockExecuteAdd).toHaveBeenCalled();
		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('languages-test-user-id');
		expect(showSuccessToast).toHaveBeenCalledWith(
			'Language added successfully'
		);
	});

	it('shows error toast when adding language fails', async () => {
		const mockExecuteAdd = vi.fn().mockRejectedValue(new Error('Add failed'));

		vi.mocked(addProfileLanguage).mockReturnValue({
			executeAdd: mockExecuteAdd,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.newSelectedLanguage.value = { name: 'German' };
		vm.newSelectedLevel.value = 'B1';

		await vm.handleAddLanguageConfirm();

		expect(showErrorToast).toHaveBeenCalledWith('Error adding language');
	});

	it('opens update language modal when handleLanguageClick is called in normal mode', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		const language = mockLanguagesData.languages[0];

		await vm.handleLanguageClick(language);

		expect(wrapper.find('[data-testid="update-language-modal"]').exists()).toBe(
			true
		);
		expect(vm.selectedLanguage.value).toEqual(language);
		expect(vm.selectedLevel.value).toBe('Native');
		expect(vm.initialLevel.value).toBe('Native');
	});

	it('updates a language successfully', async () => {
		const mockExecuteUpdate = vi.fn().mockResolvedValue({
			languages: mockLanguagesData.languages,
		});

		vi.mocked(updateProfileLanguage).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.selectedLanguage.value = mockLanguagesData.languages[0];
		vm.selectedLevel.value = 'C1';

		await vm.handleUpdateLanguageConfirm();

		expect(updateProfileLanguage).toHaveBeenCalledWith({
			userId: 'test-user-id',
			name: 'English',
			proficiency: 'C1',
		});

		expect(mockExecuteUpdate).toHaveBeenCalled();
		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('languages-test-user-id');
		expect(showSuccessToast).toHaveBeenCalledWith(
			'Language updated successfully'
		);
	});

	it('shows error toast when updating language fails', async () => {
		const mockExecuteUpdate = vi
			.fn()
			.mockRejectedValue(new Error('Update failed'));

		vi.mocked(updateProfileLanguage).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.selectedLanguage.value = mockLanguagesData.languages[0];
		vm.selectedLevel.value = 'C1';

		await vm.handleUpdateLanguageConfirm();

		expect(showErrorToast).toHaveBeenCalledWith('Error updating language');
	});

	it('toggles language selection in removal mode', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;

		const language = mockLanguagesData.languages[0];

		await vm.handleLanguageClick(language);
		expect(vm.selectedLanguagesToRemove.value.has('English')).toBe(true);

		await vm.handleLanguageClick(language);
		expect(vm.selectedLanguagesToRemove.value.has('English')).toBe(false);
	});

	it('cancels removal mode correctly', async () => {
		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedLanguagesToRemove.value.add('English');

		await vm.handleCancelRemoval();

		expect(vm.isRemovalMode.value).toBe(false);
		expect(vm.selectedLanguagesToRemove.value.size).toBe(0);
	});

	it('deletes selected languages successfully', async () => {
		const mockExecuteDelete = vi.fn().mockResolvedValue({
			languages: mockLanguagesData.languages.slice(1),
		});

		vi.mocked(deleteProfileLanguage).mockReturnValue({
			executeDelete: mockExecuteDelete,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedLanguagesToRemove.value.add('English');

		await vm.handleDeleteLanguages();

		expect(deleteProfileLanguage).toHaveBeenCalledWith('test-user-id', [
			'English',
		]);
		expect(mockExecuteDelete).toHaveBeenCalled();

		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('languages-test-user-id');
		expect(showSuccessToast).toHaveBeenCalledWith(
			'Languages deleted successfully'
		);
		expect(vm.isRemovalMode.value).toBe(false);
		expect(vm.selectedLanguagesToRemove.value.size).toBe(0);
	});

	it('shows error toast when deleting languages fails', async () => {
		const mockExecuteDelete = vi
			.fn()
			.mockRejectedValue(new Error('Delete failed'));

		vi.mocked(deleteProfileLanguage).mockReturnValue({
			executeDelete: mockExecuteDelete,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(LanguagesPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedLanguagesToRemove.value.add('English');

		await vm.handleDeleteLanguages();

		expect(showErrorToast).toHaveBeenCalledWith('Error deleting languages');
		expect(vm.isDeletingLanguages.value).toBe(false);
	});
});
