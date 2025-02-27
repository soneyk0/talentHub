import { useApolloClient } from '@vue/apollo-composable';
import { describe, expect, it, vi } from 'vitest';
import { getAllProjects } from '~/services/projects';

vi.mock('@vue/apollo-composable');

describe('getAllProjects', () => {
	it('should return projects when the request is successful', async () => {
		const mockProjects = [
			{ id: '1', name: 'Project 1' },
			{ id: '2', name: 'Project 2' },
		];

		const mockApolloClient = vi
			.fn()
			.mockResolvedValueOnce({ data: { projects: mockProjects } });

		(useApolloClient as any).mockReturnValue({
			client: { query: mockApolloClient },
		});

		const result = await getAllProjects();
		expect(mockApolloClient).toHaveBeenCalledWith({
			query: expect.anything(),
			fetchPolicy: 'network-only',
		});
		expect(result).toEqual(mockProjects);
	});

	it('should return an empty array when the request fails', async () => {
		const mockError = new Error('Error fetching projects');

		const mockApolloClient = {
			query: vi.fn().mockRejectedValueOnce(mockError),
		};

		(useApolloClient as any).mockReturnValue({
			client: mockApolloClient,
		});

		const result = await getAllProjects();
		expect(mockApolloClient.query).toHaveBeenCalledWith({
			query: expect.anything(),
			fetchPolicy: 'network-only',
		});
		expect(result).toEqual([]);
	});
});
