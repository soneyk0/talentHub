import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import CVPreviewPage from '~/pages/cvs/[id]/preview.vue';
import { getCvById } from '~/services/cv';
import { getSkillCategories, getUserById } from '~/services/user';

vi.mock('~/services/cv', () => ({
	getCvById: vi.fn(),
}));

vi.mock('~/services/user', () => ({
	getUserById: vi.fn(),
	getSkillCategories: vi.fn(),
}));

vi.mock('~/components/cv/CvPreviewProfile.vue', () => ({
	default: {
		name: 'CvPreviewProfile',
		props: ['user'],
		template: '<div data-testid="cv-preview-profile">{{ user.fullName }}</div>',
	},
}));

vi.mock('~/components/cv/CvPreviewDescription.vue', () => ({
	default: {
		name: 'CvPreviewDescription',
		props: ['groupedSkills', 'projects', 'user', 'cv'],
		template:
			'<div data-testid="cv-preview-description">{{ cv.description }}</div>',
	},
}));

vi.mock('~/components/cv/CvPreviewProjects.vue', () => ({
	default: {
		name: 'CvPreviewProjects',
		props: ['projects', 'user'],
		template:
			'<div data-testid="cv-preview-projects">{{ projects.length }} projects</div>',
	},
}));

vi.mock('~/components/cv/CvPreviewSkills.vue', () => ({
	default: {
		name: 'CvPreviewSkills',
		props: ['groupedSkills', 'skills', 'projects'],
		template:
			'<div data-testid="cv-preview-skills">{{ Object.keys(groupedSkills).length }} skill categories</div>',
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

const mockCvData = {
	cv: {
		name: 'Test CV',
		description: 'Test CV Description',
		education: 'Test Education',
		skills: [
			{ id: 'skill1', name: 'Skill 1', categoryId: 'cat1', mastery: 'EXPERT' },
			{
				id: 'skill2',
				name: 'Skill 2',
				categoryId: 'cat2',
				mastery: 'INTERMEDIATE',
			},
		],
		projects: [
			{ id: 'proj1', name: 'Project 1', description: 'Project 1 Description' },
			{ id: 'proj2', name: 'Project 2', description: 'Project 2 Description' },
		],
	},
};

const mockUserData = {
	user: {
		profile: {
			full_name: 'Test User',
			languages: [
				{ name: 'English', proficiency: 'Native' },
				{ name: 'Spanish', proficiency: 'Intermediate' },
			],
		},
		position: {
			name: 'Software Developer',
		},
	},
};

const mockCategoriesData = {
	categories: [
		{ id: 'cat1', name: 'Category 1' },
		{ id: 'cat2', name: 'Category 2' },
	],
};

describe('CV Preview Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getCvById).mockResolvedValue({
			cv: mockCvData.cv,
			error: null,
		});

		vi.mocked(getUserById).mockResolvedValue({
			user: mockUserData.user,
			error: null,
		});

		vi.mocked(getSkillCategories).mockResolvedValue({
			categories: mockCategoriesData.categories,
			error: null,
		});

		mockNuxtImport('useNuxtData', () => {
			return (key: string) => {
				return { data: { value: null } };
			};
		});

		mockNuxtImport('useAsyncData', () => {
			return async (key: string, fetcher: any) => {
				const result = await fetcher();

				if (key.includes('user-test-cv-id')) {
					return {
						data: { value: { cv: mockCvData.cv } },
						refresh: vi.fn(),
					};
				} else if (key.includes('user-test-user-id')) {
					return {
						data: { value: { user: mockUserData.user } },
						refresh: vi.fn(),
					};
				} else if (key === 'skill-categories') {
					return {
						data: { value: { categories: mockCategoriesData.categories } },
						refresh: vi.fn(),
					};
				}
				return { data: { value: result }, refresh: vi.fn() };
			};
		});
	});

	it('renders the CV preview components', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		expect(wrapper.find('[data-testid="cv-preview-profile"]').exists()).toBe(
			true
		);
		expect(
			wrapper.find('[data-testid="cv-preview-description"]').exists()
		).toBe(true);
		expect(wrapper.find('[data-testid="cv-preview-projects"]').exists()).toBe(
			true
		);
		expect(wrapper.find('[data-testid="cv-preview-skills"]').exists()).toBe(
			true
		);
	});

	it('passes correct user data to profile component', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		const profileComponent = wrapper.find('[data-testid="cv-preview-profile"]');
		expect(profileComponent.text()).toContain('Test User');
	});

	it('passes correct CV data to description component', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		const descriptionComponent = wrapper.find(
			'[data-testid="cv-preview-description"]'
		);
		expect(descriptionComponent.text()).toContain('Test CV Description');
	});

	it('passes correct projects data to projects component', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		const projectsComponent = wrapper.find(
			'[data-testid="cv-preview-projects"]'
		);
		expect(projectsComponent.text()).toContain('2 projects');
	});

	it('passes correct grouped skills data to skills component', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		const skillsComponent = wrapper.find('[data-testid="cv-preview-skills"]');
		expect(skillsComponent.text()).toContain('2 skill categories');
	});

	it('fetches CV data using the correct ID from route params', async () => {
		await mountSuspended(CVPreviewPage);

		expect(getCvById).toHaveBeenCalledWith('test-cv-id');
	});

	it('fetches user data using the current user ID', async () => {
		await mountSuspended(CVPreviewPage);

		expect(getUserById).toHaveBeenCalledWith('test-user-id', true);
	});

	it('fetches skill categories', async () => {
		await mountSuspended(CVPreviewPage);

		expect(getSkillCategories).toHaveBeenCalled();
	});

	it('correctly groups skills by category', async () => {
		const wrapper = await mountSuspended(CVPreviewPage);

		const vm = wrapper.vm as any;
		const groupedSkills = vm.groupedSkills;

		expect(Object.keys(groupedSkills).length).toBe(2);
		expect(groupedSkills['Category 1']).toHaveLength(1);
		expect(groupedSkills['Category 2']).toHaveLength(1);
		expect(groupedSkills['Category 1'][0].name).toBe('Skill 1');
		expect(groupedSkills['Category 2'][0].name).toBe('Skill 2');
	});
});
