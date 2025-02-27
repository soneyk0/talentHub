import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import {
	addCvSkill,
	createCv,
	createCvProjects,
	deleteCv,
	deleteCvSkill,
	getAllCvs,
	getCvById,
	getCvFullname,
	getCvProjects,
	getCvSkills,
	removeCvProject,
	updateCv,
	updateCvProject,
	updateCvSkill,
} from '~/services/cv';

vi.mock('@vue/apollo-composable', () => ({
	useQuery: vi.fn(),
	useMutation: vi.fn(),
	useApolloClient: vi.fn(() => ({
		client: {
			query: vi.fn(),
			mutate: vi.fn(),
		},
	})),
}));

describe('cv service', () => {
	const mockCvId = '123';
	const mockProjectId = '456';
	const mockCategoryId = '456';

	describe('getCvById', () => {
		test('successfully fetches cv by id', async () => {
			const mockCv = { id: mockCvId, name: 'Test CV' };
			const mockQuery = vi.fn().mockResolvedValue({
				data: { cv: mockCv },
			});
			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvById(mockCvId);

			expect(mockQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { cvId: mockCvId },
				})
			);
			expect(result.cv).toEqual(mockCv);
			expect(result.error).toBeNull();
		});

		test('handles error when fetching CV', async () => {
			const mockError = new Error('Failed to fetch CV');
			const mockQuery = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvById(mockCvId);

			expect(result.cv).toBeNull();
			expect(result.error).toBe(mockError);
		});
	});

	describe('getAllCvs', () => {
		test('successfully fetches all CVs', async () => {
			const mockCvs = [
				{ id: '1', name: 'CV 1' },
				{ id: '2', name: 'CV 2' },
			];
			const mockQuery = vi.fn().mockResolvedValue({
				data: { cvs: mockCvs },
			});

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getAllCvs();

			expect(mockQuery).toHaveBeenCalled();
			expect(result).toEqual(mockCvs);
		});

		test('returns empty array on error', async () => {
			const mockQuery = vi
				.fn()
				.mockRejectedValue(new Error('Failed to fetch CVs'));

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getAllCvs();

			expect(result).toEqual([]);
		});
	});

	describe('createCv', () => {
		const mockCvData = {
			name: 'New CV',
			description: 'Test description',
			education: 'Test education',
			userId: 'user123',
		};

		test('successfully creates CV', async () => {
			const mockResponse = { data: { createCv: { id: mockCvId } } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const result = await createCv(mockCvData);

			expect(mutate).toHaveBeenCalledWith({ cv: mockCvData });
			expect(result).toEqual(mockResponse.data.createCv);
		});

		test('handles create CV error', async () => {
			const mockError = new Error('Failed to create CV');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			await expect(createCv(mockCvData)).rejects.toThrow('Failed to create CV');
		});
	});

	describe('deleteCv', () => {
		test('successfully deletes CV', async () => {
			const mockResponse = { data: { deleteCv: { id: mockCvId } } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const result = await deleteCv(mockCvId);

			expect(mutate).toHaveBeenCalledWith({ cv: { cvId: mockCvId } });
			expect(result).toEqual(mockResponse.data.deleteCv);
		});

		test('handles delete CV error', async () => {
			const mockError = new Error('Failed to delete CV');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			await expect(deleteCv(mockCvId)).rejects.toThrow('Failed to delete CV');
		});
	});

	describe('updateCv', () => {
		const mockUpdateData = {
			cvId: mockCvId,
			name: 'Updated CV',
			description: 'Updated description',
			education: 'Updated education',
		};

		test('successfully updates CV', async () => {
			const mockResponse = { data: { updateCv: mockUpdateData } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeUpdate } = updateCv(mockUpdateData);
			const result = await executeUpdate();

			expect(mutate).toHaveBeenCalledWith({ cv: mockUpdateData });
			expect(result).toEqual(mockResponse.data.updateCv);
		});

		test('handles update CV error', async () => {
			const mockError = new Error('Failed to update CV');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);
			const { executeUpdate } = updateCv(mockUpdateData);
			await expect(executeUpdate()).rejects.toThrow('Failed to update CV');
		});
	});

	describe('getCvProjects', () => {
		test('successfully fetches CV projects', async () => {
			const mockProjects = [
				{ id: '1', name: 'Project 1' },
				{ id: '2', name: 'Project 2' },
			];
			const mockQuery = vi.fn().mockResolvedValue({
				data: { cv: { projects: mockProjects } },
			});

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvProjects(mockCvId);

			expect(mockQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { cvId: mockCvId },
				})
			);
			expect(result).toEqual(mockProjects);
		});

		test('returns empty array on error', async () => {
			const mockQuery = vi
				.fn()
				.mockRejectedValue(new Error('Failed to fetch projects'));

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvProjects(mockCvId);
			expect(result).toEqual([]);
		});
	});

	describe('createCvProjects', () => {
		const mockProjectData = {
			cvId: mockCvId,
			projectId: mockProjectId,
			start_date: '2023-01',
			end_date: 's2023-12',
			roles: ['role1', 'role2'],
			responsibilities: ['responsibility1', 'responsibility2'],
		};

		test('successfully creates CV project', async () => {
			const mockResponse = { data: { addCvProject: mockProjectData } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const result = await createCvProjects(mockProjectData);

			expect(mutate).toHaveBeenCalledWith({ project: mockProjectData });
			expect(result).toEqual(mockResponse.data.addCvProject);
		});

		test('handles create project error', async () => {
			const mockError = new Error('Failed to create project');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			await expect(createCvProjects(mockProjectData)).rejects.toThrow(
				'Failed to create project'
			);
		});
	});

	describe('removeCvProject', () => {
		test('successfully removes CV project', async () => {
			const mockResponse = { data: { removeCvProject: { id: mockProjectId } } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const result = await removeCvProject(mockCvId, mockProjectId);

			expect(mutate).toHaveBeenCalledWith({
				project: { cvId: mockCvId, projectId: mockProjectId },
			});
			expect(result).toEqual(mockResponse.data.removeCvProject);
		});
	});

	describe('updateCvProject', () => {
		const mockUpdateData = {
			cvId: mockCvId,
			projectId: mockProjectId,
			start_date: '2023-01',
			end_date: '2023-12',
			roles: ['role1', 'role2'],
			responsibilities: ['responsibility1', 'responsibility2'],
		};

		test('successfully updates CV project', async () => {
			const mockResponse = { data: { updateCvProject: mockUpdateData } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const result = await updateCvProject(mockUpdateData);

			expect(mutate).toHaveBeenCalledWith({ project: mockUpdateData });
			expect(result).toEqual(mockResponse.data.updateCvProject);
		});

		test('handles update project error', async () => {
			const mockError = new Error('Failed to update project');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			await expect(updateCvProject(mockUpdateData)).rejects.toThrow(
				'Failed to update project'
			);
		});
	});

	describe('getCvSkills', () => {
		test('successfully fetches CV skills', async () => {
			const mockSkills = [
				{ name: 'Skill 1', mastery: 'EXPERT' },
				{ name: 'Skill 2', mastery: 'INTERMEDIATE' },
			];
			const mockQuery = vi.fn().mockResolvedValue({
				data: { cv: { skills: mockSkills } },
			});

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvSkills(mockCvId);

			expect(mockQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { cvId: mockCvId },
				})
			);
			expect(result.skills).toEqual(mockSkills);
			expect(result.error).toBeNull();
		});

		test('handles error when fetching skills', async () => {
			const mockError = new Error('Failed to fetch skills');
			const mockQuery = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useApolloClient).mockReturnValue({
				client: { query: mockQuery } as any,
			});

			const result = await getCvSkills(mockCvId);
			expect(result.skills).toEqual([]);
			expect(result.error).toBe(mockError);
		});
	});

	describe('addCvSkill', () => {
		const mockSkillData = {
			cvId: mockCvId,
			name: 'New Skill',
			categoryId: mockCategoryId,
			mastery: 'Expert' as const,
		};

		test('successfully adds CV skill', async () => {
			const mockResponse = { data: { addCvSkill: mockSkillData } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeAdd } = addCvSkill(mockSkillData);
			const result = await executeAdd();

			expect(mutate).toHaveBeenCalledWith({ skill: mockSkillData });
			expect(result).toEqual(mockResponse.data.addCvSkill);
		});

		test('handles add skill error', async () => {
			const mockError = new Error('Failed to add skill');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeAdd } = addCvSkill(mockSkillData);
			await expect(executeAdd()).rejects.toThrow('Failed to add skill');
		});
	});

	describe('updateCvSkill', () => {
		const mockUpdateData = {
			cvId: mockCvId,
			name: 'Updated Skill',
			categoryId: mockCategoryId,
			mastery: 'Novice' as const,
		};

		test('successfully updates CV skill', async () => {
			const mockResponse = { data: { updateCvSkill: mockUpdateData } };
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeUpdate } = updateCvSkill(mockUpdateData);
			const result = await executeUpdate();

			expect(mutate).toHaveBeenCalledWith({ skill: mockUpdateData });
			expect(result).toEqual(mockResponse.data.updateCvSkill);
		});

		test('handles update skill error', async () => {
			const mockError = new Error('Failed to update skill');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeUpdate } = updateCvSkill(mockUpdateData);
			await expect(executeUpdate()).rejects.toThrow('Failed to update skill');
		});
	});

	describe('deleteCvSkill', () => {
		const mockSkillNames = ['Skill 1', 'Skill 2'];

		test('successfully deletes CV skills', async () => {
			const mockResponse = {
				data: {
					deleteCvSkill: { success: true },
				},
			};
			const mutate = vi.fn().mockResolvedValue(mockResponse);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeDelete } = deleteCvSkill(mockCvId, mockSkillNames);
			const result = await executeDelete();

			expect(mutate).toHaveBeenCalledWith({
				skill: {
					cvId: mockCvId,
					name: mockSkillNames,
				},
			});
			expect(result).toEqual(mockResponse.data.deleteCvSkill);
		});

		test('handles delete skills error', async () => {
			const mockError = new Error('Failed to delete skills');
			const mutate = vi.fn().mockRejectedValue(mockError);

			vi.mocked(useMutation).mockReturnValue({
				mutate,
				onDone: vi.fn(),
				onError: vi.fn(),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { executeDelete } = deleteCvSkill(mockCvId, mockSkillNames);
			await expect(executeDelete()).rejects.toThrow('Failed to delete skills');
		});
	});

	describe('getCvFullname', () => {
		test('successfully gets CV fullname', () => {
			const mockName = 'Test CV Name';

			vi.mocked(useQuery).mockReturnValue({
				result: ref({ cv: { name: mockName } }),
				loading: ref(false),
				error: ref(null),
			} as any);

			const { fullname, loading, error } = getCvFullname(mockCvId);

			expect(fullname).toBe(mockName);
			expect(loading.value).toBe(false);
			expect(error.value).toBeNull();
		});
	});
});
