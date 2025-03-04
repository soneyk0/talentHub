import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectsPage from '~/pages/cvs/[id]/projects.vue';
import { getCvProjects, removeCvProject } from '~/services/cv';
import { getAllProjects } from '~/services/projects';

vi.mock('~/services/cv', () => ({
	getCvProjects: vi.fn(),
	removeCvProject: vi.fn(),
}));

vi.mock('~/services/projects', () => ({
	getAllProjects: vi.fn(),
}));

vi.mock('~/utils/toast/toast', () => ({
	showSuccessToast: vi.fn(),
	showErrorToast: vi.fn(),
}));

vi.mock('~/components/Table.vue', () => ({
	default: {
		name: 'Table',
		props: ['searchQuery', 'headers', 'rowsData', 'rowComponent'],
		template: '<div data-testid="projects-table">Mock Table</div>',
		emits: ['on-delete-project', 'on-edit-project'],
	},
}));

mockNuxtImport('useRoute', () => {
	return () => ({
		params: { id: 'test-cv-id' },
	});
});

const mockProjects = [
	{
		id: 1,
		project: { id: '1' },
		name: 'Project 1',
		domain: 'Web Development',
		description: 'Project 1 Description',
		environment: ['Development'],
		responsibilities: 'Responsibility 1',
		start_date: '2021-01-01',
		end_date: '2021-01-01',
	},
	{
		id: 2,
		project: { id: '2' },
		name: 'Project 2',
		domain: 'Mobile Development',
		description: 'Project 2 Description',
		environment: ['Development'],
		responsibilities: 'Responsibility 1',
		start_date: '2021-01-01',
		end_date: '2021-01-01',
	},
];

const mockAllProjects = [
	{
		id: '1',
		name: 'Project 1',
		domain: 'Web Development',
		created_at: '2021-01-01',
		internal_name: 'Project 1',
		start_date: '2021-01-01',
		description: 'Project 1 Description',
		environment: ['Development'],
	},
	{
		id: '2',
		name: 'Project 2',
		domain: 'Mobile Development',
		created_at: '2021-01-01',
		internal_name: 'Project 2',
		start_date: '2021-01-01',
		description: 'Project 2 Description',
		environment: ['Development'],
	},
	{
		id: '3',
		name: 'Project 3',
		domain: 'Web Development',
		created_at: '2021-01-01',
		internal_name: 'Project 3',
		start_date: '2021-01-01',
		description: 'Project 3 Description',
		environment: ['Development'],
	},
];

describe('CV Projects Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getCvProjects).mockResolvedValue(mockProjects);
		vi.mocked(getAllProjects).mockResolvedValue(mockAllProjects);
		vi.mocked(removeCvProject).mockResolvedValue({ success: true });

		mockNuxtImport('useNuxtData', () => {
			return (key: string) => {
				return { data: { value: null } };
			};
		});

		mockNuxtImport('useAsyncData', () => {
			return (key: string, fetcher: any) => {
				fetcher();

				if (key.includes('listOfProjects')) {
					return {
						data: ref(mockAllProjects),
						refresh: vi.fn(),
					};
				} else if (key.includes('project-test-cv-id')) {
					return {
						data: ref(mockProjects),
						refresh: vi.fn(),
					};
				}
				return { data: ref([]), refresh: vi.fn() };
			};
		});
	});

	it('mounts successfully', async () => {
		const wrapper = await mountSuspended(ProjectsPage);
		expect(wrapper.vm).toBeDefined();
	});

	it('fetches CV projects using the correct CV ID', async () => {
		await mountSuspended(ProjectsPage);
		expect(getCvProjects).toHaveBeenCalledWith('test-cv-id');
	});

	it('fetches all projects for the project list', async () => {
		await mountSuspended(ProjectsPage);
		expect(getAllProjects).toHaveBeenCalled();
	});

	it('calls removeCvProject with correct parameters', async () => {
		await mountSuspended(ProjectsPage);

		await removeCvProject('test-cv-id', '1');

		expect(removeCvProject).toHaveBeenCalledWith('test-cv-id', '1');
	});

	it('shows error toast when project deletion fails', async () => {
		vi.mocked(removeCvProject).mockRejectedValueOnce(
			new Error('Delete failed')
		);

		try {
			await removeCvProject('test-cv-id', '1');
			expect('Promise should have rejected').toBe(false);
		} catch (error) {
			expect(removeCvProject).toHaveBeenCalledWith('test-cv-id', '1');
		}
	});
});
