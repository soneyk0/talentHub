import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import CVSkillsPage from '~/pages/cvs/[id]/skills.vue';
import {
	addCvSkill,
	deleteCvSkill,
	getCvSkills,
	updateCvSkill,
} from '~/services/cv';
import { getAllSkills, getSkillCategories } from '~/services/user';
import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

vi.mock('~/services/cv', () => ({
	getCvSkills: vi.fn(),
	addCvSkill: vi.fn(),
	updateCvSkill: vi.fn(),
	deleteCvSkill: vi.fn(),
}));

vi.mock('~/services/user', () => ({
	getAllSkills: vi.fn(),
	getSkillCategories: vi.fn(),
}));

vi.mock('~/utils/toast/toast', () => ({
	showSuccessToast: vi.fn(),
	showErrorToast: vi.fn(),
}));

vi.mock('~/components/cv/CvSkillList.vue', () => ({
	default: {
		name: 'CvSkillList',
		props: [
			'categories',
			'skills',
			'isRemovalMode',
			'selectedSkillsToRemove',
			'canEdit',
		],
		template:
			'<div data-testid="cv-skill-list">{{ skills.length }} skills</div>',
	},
}));

vi.mock('~/components/cv/CvSkillActions.vue', () => ({
	default: {
		name: 'CvSkillActions',
		props: [
			'skills',
			'isRemovalMode',
			'selectedSkillsToRemove',
			'isDeletingSkills',
		],
		template: '<div data-testid="cv-skill-actions"></div>',
	},
}));

vi.mock('~/components/modals/UpdateSkillModal.vue', () => ({
	default: {
		name: 'UpdateSkillModal',
		props: [
			'isOpen',
			'selectedSkill',
			'selectedLevel',
			'initialLevel',
			'skillLevels',
		],
		template: '<div data-testid="update-skill-modal" v-if="isOpen"></div>',
	},
}));

vi.mock('~/components/modals/AddSkillModal.vue', () => ({
	default: {
		name: 'AddSkillModal',
		props: [
			'isOpen',
			'selectedSkill',
			'selectedLevel',
			'skillOptions',
			'skillLevels',
		],
		template: '<div data-testid="add-skill-modal" v-if="isOpen"></div>',
	},
}));

mockNuxtImport('useRoute', () => {
	return () => ({
		params: { id: 'test-cv-id' },
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

const mockSkillsData = {
	skills: [
		{ id: 'skill1', name: 'JavaScript', categoryId: 'cat1', mastery: 'EXPERT' },
		{
			id: 'skill2',
			name: 'TypeScript',
			categoryId: 'cat1',
			mastery: 'INTERMEDIATE',
		},
		{ id: 'skill3', name: 'React', categoryId: 'cat2', mastery: 'ADVANCED' },
	],
};

const mockCategoriesData = {
	categories: [
		{ id: 'cat1', name: 'Programming Languages', parent: null },
		{ id: 'cat2', name: 'Frameworks', parent: null },
		{ id: 'cat3', name: 'Tools', parent: null },
	],
};

const mockAllSkillsData = {
	skills: [
		{
			id: 'skill1',
			name: 'JavaScript',
			category: { id: 'cat1', order: 1 },
			category_name: 'Programming Languages',
			category_parent_name: '',
		},
		{
			id: 'skill2',
			name: 'TypeScript',
			category: { id: 'cat1', order: 2 },
			category_name: 'Programming Languages',
			category_parent_name: '',
		},
		{
			id: 'skill3',
			name: 'React',
			category: { id: 'cat2', order: 1 },
			category_name: 'Frameworks',
			category_parent_name: '',
		},
		{
			id: 'skill4',
			name: 'Vue',
			category: { id: 'cat2', order: 2 },
			category_name: 'Frameworks',
			category_parent_name: '',
		},
		{
			id: 'skill5',
			name: 'Git',
			category: { id: 'cat3', order: 1 },
			category_name: 'Tools',
			category_parent_name: '',
		},
	],
};

describe('CV Skills Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getCvSkills).mockResolvedValue({
			skills: mockSkillsData.skills,
			error: null,
		});

		vi.mocked(getSkillCategories).mockResolvedValue({
			categories: mockCategoriesData.categories,
			error: null,
		});

		vi.mocked(getAllSkills).mockResolvedValue({
			skills: mockAllSkillsData.skills,
			error: null,
		});

		vi.mocked(addCvSkill).mockResolvedValue({
			skills: [
				...mockSkillsData.skills,
				{ id: 'skill4', name: 'Vue', categoryId: 'cat2', mastery: 'BEGINNER' },
			],
			error: null,
		});

		vi.mocked(updateCvSkill).mockReturnValue({
			executeUpdate: vi.fn().mockResolvedValue({
				skills: mockSkillsData.skills.map((skill) =>
					skill.name === 'JavaScript'
						? { ...skill, mastery: 'ADVANCED' }
						: skill
				),
				error: null,
			}),
			loading: ref(false),
			error: ref(null),
		});

		vi.mocked(deleteCvSkill).mockReturnValue({
			executeDelete: vi.fn().mockResolvedValue({
				skills: mockSkillsData.skills.filter(
					(skill) => skill.name !== 'JavaScript'
				),
				error: null,
			}),
			loading: ref(false),
			error: ref(null),
		});

		mockNuxtImport('useNuxtData', () => {
			return (key: string) => {
				if (key === `skills-test-cv-id`) {
					return { data: { value: null } };
				} else if (key === 'skill-categories') {
					return {
						data: { value: null },
					};
				} else if (key === 'all-skills') {
					return { data: { value: null } };
				}
				return { data: { value: null } };
			};
		});
	});

	it('renders the skills page with skill list', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		expect(wrapper.find('[data-testid="cv-skill-list"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="cv-skill-list"]').text()).toContain(
			'3 skills'
		);
	});

	it('renders skill actions when user can edit', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		expect(wrapper.find('[data-testid="cv-skill-actions"]').exists()).toBe(
			true
		);
	});

	it('fetches CV skills using the correct ID from route params', async () => {
		await mountSuspended(CVSkillsPage);

		expect(getCvSkills).toHaveBeenCalledWith('test-cv-id');
	});

	it('fetches skill categories', async () => {
		await mountSuspended(CVSkillsPage);

		expect(getSkillCategories).toHaveBeenCalled();
	});

	it('fetches all skills', async () => {
		await mountSuspended(CVSkillsPage);

		expect(getAllSkills).toHaveBeenCalled();
	});

	it('filters categories with skills correctly', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		expect(vm.categoriesWithSkills.length).toBe(2);
		expect(vm.categoriesWithSkills[0].name).toBe('Programming Languages');
		expect(vm.categoriesWithSkills[1].name).toBe('Frameworks');
	});

	it('opens add skill modal when handleAddSkill is called', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		await vm.handleAddSkill();

		expect(wrapper.find('[data-testid="add-skill-modal"]').exists()).toBe(true);
	});

	it('adds a new skill successfully', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);
		await wrapper.find('[data-testid="cv-skill-actions"]').trigger('click');

		const vm = wrapper.vm as any;

		vm.newSelectedSkill.value = {
			id: 'skill4',
			name: 'Vue',
			category: { id: 'cat2', order: 2 },
			category_name: 'Frameworks',
			category_parent_name: '',
		};
		vm.newSelectedLevel.value = 'BEGINNER';

		await vm.handleAddSkillConfirm();

		expect(addCvSkill).toHaveBeenCalledWith({
			cvId: 'test-cv-id',
			name: 'Vue',
			categoryId: 'skill4',
			mastery: 'BEGINNER',
		});

		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('skills-test-cv-id');
		expect(showSuccessToast).toHaveBeenCalledWith('Skill added successfully');
	});

	it('shows error toast when adding skill fails', async () => {
		vi.mocked(addCvSkill).mockRejectedValue(new Error('Add failed'));

		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.newSelectedSkill.value = mockAllSkillsData.skills[3];
		vm.newSelectedLevel.value = 'BEGINNER';

		await vm.handleAddSkillConfirm();

		expect(showErrorToast).toHaveBeenCalledWith('Error adding skill');
	});

	it('opens update skill modal when handleSkillClick is called in normal mode', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		const skill = mockSkillsData.skills[0];

		await vm.handleSkillClick(skill);

		expect(wrapper.find('[data-testid="update-skill-modal"]').exists()).toBe(
			true
		);
		expect(vm.selectedLevel.value).toBe('EXPERT');
		expect(vm.initialLevel.value).toBe('EXPERT');
	});

	it('updates a skill successfully', async () => {
		const mockExecuteUpdate = vi.fn().mockResolvedValue({
			skills: mockSkillsData.skills,
		});

		vi.mocked(updateCvSkill).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.selectedSkill.value = mockSkillsData.skills[0];
		vm.selectedLevel.value = 'ADVANCED';

		await vm.handleUpdateSkillConfirm();

		expect(updateCvSkill).toHaveBeenCalledWith({
			cvId: 'test-cv-id',
			name: 'JavaScript',
			categoryId: 'cat1',
			mastery: 'ADVANCED',
		});

		expect(mockExecuteUpdate).toHaveBeenCalled();
		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('skills-test-cv-id');
		expect(showSuccessToast).toHaveBeenCalledWith('Skill updated successfully');
	});

	it('shows error toast when updating skill fails', async () => {
		const mockExecuteUpdate = vi
			.fn()
			.mockRejectedValue(new Error('Update failed'));

		vi.mocked(updateCvSkill).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.selectedSkill.value = mockSkillsData.skills[0];
		vm.selectedLevel.value = 'ADVANCED';

		await vm.handleUpdateSkillConfirm();

		expect(showErrorToast).toHaveBeenCalledWith('Error updating skill');
	});

	it('toggles skill selection in removal mode', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;

		const skill = mockSkillsData.skills[0];

		await vm.handleSkillClick(skill);
		expect(vm.selectedSkillsToRemove.value.has('JavaScript')).toBe(true);

		await vm.handleSkillClick(skill);
		expect(vm.selectedSkillsToRemove.value.has('JavaScript')).toBe(false);
	});

	it('cancels removal mode correctly', async () => {
		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedSkillsToRemove.value.add('JavaScript');

		await vm.handleCancelRemoval();

		expect(vm.isRemovalMode.value).toBe(false);
		expect(vm.selectedSkillsToRemove.value.size).toBe(0);
	});

	it('deletes selected skills successfully', async () => {
		const mockExecuteDelete = vi.fn().mockResolvedValue({
			skills: mockSkillsData.skills.slice(1),
		});

		vi.mocked(deleteCvSkill).mockReturnValue({
			executeDelete: mockExecuteDelete,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedSkillsToRemove.value.add('JavaScript');

		await vm.handleDeleteSkills();

		expect(deleteCvSkill).toHaveBeenCalledWith('test-cv-id', ['JavaScript']);
		expect(mockExecuteDelete).toHaveBeenCalled();

		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('skills-test-cv-id');
		expect(showSuccessToast).toHaveBeenCalledWith(
			'Skills deleted successfully'
		);
		expect(vm.isRemovalMode.value).toBe(false);
		expect(vm.selectedSkillsToRemove.value.size).toBe(0);
	});

	it('shows error toast when deleting skills fails', async () => {
		const mockExecuteDelete = vi
			.fn()
			.mockRejectedValue(new Error('Delete failed'));

		vi.mocked(deleteCvSkill).mockReturnValue({
			executeDelete: mockExecuteDelete,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVSkillsPage);

		const vm = wrapper.vm as any;
		vm.isRemovalMode.value = true;
		vm.selectedSkillsToRemove.value.add('JavaScript');

		await vm.handleDeleteSkills();

		expect(showErrorToast).toHaveBeenCalledWith('Error deleting skills');
		expect(vm.isDeletingSkills.value).toBe(false);
	});
});
