import { useApolloClient, useMutation } from '@vue/apollo-composable';
import { describe, expect, it, vi } from 'vitest';
import {
	addProfileLanguage,
	addProfileSkill,
	deleteAvatar,
	deleteProfileLanguage,
	deleteProfileSkill,
	getAllDepartments,
	getAllLanguages,
	getAllPositions,
	getAllSkills,
	getAllUsers,
	getProfileLanguages,
	getProfileSkills,
	getSkillCategories,
	getUserById,
	getUserFullname,
	updateProfile,
	updateProfileLanguage,
	updateProfileSkill,
	updateUser,
	uploadAvatar,
} from '~/services/user';

import type { LanguageLevel, SkillLevel } from '~/global';

vi.mock('@vue/apollo-composable');

describe('User testing', () => {
	describe('getUserById', () => {
		const mockData = { user: { id: '123' } };
		it('Should successfully return user data by ID', async () => {
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockResolvedValueOnce({ data: mockData }),
				},
			});

			const result = await getUserById('123');
			expect(result).toEqual({ user: mockData.user, error: null });
		});

		it('Should return an error if the request fails', async () => {
			const mockError = new Error('Fetching user failed');
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockRejectedValueOnce(mockError),
				},
			});

			const result = await getUserById('123');
			expect(result).toEqual({ user: null, error: mockError });
		});

		it('Should use network-only fetchPolicy if skipCache is true', async () => {
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockResolvedValueOnce({ data: mockData }),
				},
			});

			await getUserById('123', true);
			expect(useApolloClient().client.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'network-only',
				})
			);
		});

		it('Should use cache-first fetchPolicy by default', async () => {
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockResolvedValueOnce({ data: mockData }),
				},
			});

			await getUserById('123');
			expect(useApolloClient().client.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'cache-first',
				})
			);
		});
	});

	describe('getAllDepartments', () => {
		it('Should successfully return list of departments', async () => {
			const mockData = {
				departments: [
					{ id: '1', name: 'HR' },
					{ id: '2', name: 'Engineering' },
				],
			};
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockResolvedValueOnce({ data: mockData }),
				},
			});

			const result = await getAllDepartments();
			expect(result).toEqual({
				departments: mockData.departments,
				error: null,
			});
		});

		it('Should return an error if the request fails', async () => {
			const mockError = new Error('Fetching departments failed');
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockRejectedValueOnce(mockError),
				},
			});

			const result = await getAllDepartments();
			expect(result).toEqual({ departments: [], error: mockError });
		});
	});

	describe('getAllPositions', () => {
		it('Should successfully return list of positions', async () => {
			const mockData = {
				positions: [
					{ id: '1', name: 'Developer' },
					{ id: '2', name: 'Designer' },
				],
			};
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockResolvedValueOnce({ data: mockData }),
				},
			});

			const result = await getAllPositions();
			expect(result).toEqual({ positions: mockData.positions, error: null });
		});

		it('Should return an error if the request fails', async () => {
			const mockError = new Error('Fetching positions failed');
			(useApolloClient as any).mockReturnValue({
				client: {
					query: vi.fn().mockRejectedValueOnce(mockError),
				},
			});

			const result = await getAllPositions();
			expect(result).toEqual({ positions: [], error: mockError });
		});
	});

	describe('updateUser', () => {
		const user = { userId: '123', departmentId: '1', positionId: '1' };

		it('Should successfully update user', async () => {
			const mockExecuteUpdate = vi.fn().mockResolvedValueOnce({
				data: {
					updateUser: {
						userId: '123',
						departmentId: '2',
						positionId: '2',
					},
				},
			});

			(useMutation as any).mockReturnValue({
				mutate: mockExecuteUpdate,
				loading: false,
				error: null,
			});

			const { executeUpdate, loading, error } = updateUser(user);
			const result = await executeUpdate();
			expect(mockExecuteUpdate).toHaveBeenCalledWith({ user });
			expect(result).toEqual({
				userId: '123',
				departmentId: '2',
				positionId: '2',
			});
			expect(loading).toBe(false);
			expect(error).toBeNull();
		});

		it('Should throw an error when user update fails', async () => {
			const mockError = new Error('Update user failed');
			const mockExecuteUpdate = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockExecuteUpdate,
				loading: false,
				error: mockError,
			});

			const { executeUpdate, loading, error } = updateUser(user);
			await expect(executeUpdate()).rejects.toThrow('Update user failed');
			expect(mockExecuteUpdate).toHaveBeenCalledWith({ user });
			expect(loading).toBe(false);
			expect(error).toEqual(mockError);
		});
	});

	describe('updateProfile', () => {
		const profile = { userId: '123', first_name: 'Test', last_name: 'Test' };

		it('Should successfully update profile', async () => {
			const mockExecuteUpdate = vi.fn().mockResolvedValueOnce({
				data: {
					updateProfile: {
						userId: '123',
						first_name: 'Test1',
						last_name: 'Test',
					},
				},
			});
			(useMutation as any).mockReturnValue({
				mutate: mockExecuteUpdate,
				loading: false,
				error: null,
			});

			const { executeUpdate, loading, error } = updateProfile(profile);
			const result = await executeUpdate();
			expect(mockExecuteUpdate).toHaveBeenCalledWith({ profile });
			expect(result).toEqual({
				userId: '123',
				first_name: 'Test1',
				last_name: 'Test',
			});
			expect(loading).toBe(false);
			expect(error).toBeNull();
		});

		it('Should throw an error if profile update fails', async () => {
			const mockError = new Error('Update profile failed');
			const mockExecuteUpdate = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockExecuteUpdate,
				loading: false,
				error: mockError,
			});

			const { executeUpdate, loading, error } = updateProfile(profile);
			await expect(executeUpdate()).rejects.toThrow('Update profile failed');
			expect(mockExecuteUpdate).toHaveBeenCalledWith({ profile });
			expect(loading).toBe(false);
			expect(error).toEqual(mockError);
		});
	});

	describe('uploadAvatar', () => {
		const avatar = {
			userId: '123',
			base64: 'abc',
			size: 0.5,
			type: 'png',
		};
		it('Should successfully upload avatar', async () => {
			const mockResponse = { success: true };
			(useMutation as any).mockReturnValue({
				mutate: vi.fn().mockResolvedValueOnce(mockResponse),
				loading: false,
				error: null,
			});

			const { executeUpload } = uploadAvatar(avatar);

			const result = await executeUpload();
			expect(result).toEqual(mockResponse);
			expect(useMutation().mutate).toHaveBeenCalledWith({ avatar });
		});

		it('Should return an error when avatar loading fails', async () => {
			const mockError = new Error('Upload failed');
			(useMutation as any).mockReturnValue({
				mutate: vi.fn().mockRejectedValueOnce(mockError),
				loading: false,
				error: mockError,
			});

			const { executeUpload } = uploadAvatar(avatar);

			await expect(executeUpload()).rejects.toThrow('Upload failed');
			expect(useMutation().mutate).toHaveBeenCalledWith({
				avatar: { ...avatar },
			});
		});

		it('Should set loading to true when calling executeUpload', async () => {
			(useMutation as any).mockReturnValue({
				mutate: vi.fn(),
				loading: true,
				error: null,
			});

			const { loading } = uploadAvatar(avatar);
			expect(loading).toBe(true);
		});

		it('Should correctly pass data for the avatar to mutate', async () => {
			const mockResponse = { data: { uploadAvatar: { success: true } } };
			(useMutation as any).mockReturnValue({
				mutate: vi.fn().mockResolvedValueOnce(mockResponse),
				loading: false,
				error: null,
			});

			const { executeUpload } = uploadAvatar(avatar);
			await executeUpload();
			expect(useMutation().mutate).toHaveBeenCalledWith({
				avatar: { ...avatar },
			});
		});
	});

	describe('deleteAvatar', () => {
		const userId = '123';

		it('Should successfully delete avatar', async () => {
			const mockExecuteDelete = vi
				.fn()
				.mockResolvedValueOnce({ userId: '123', success: true });

			(useMutation as any).mockReturnValue({
				mutate: mockExecuteDelete,
				loading: false,
				error: null,
			});

			const { executeDelete, loading, error } = deleteAvatar(userId);
			const result = await executeDelete();
			expect(mockExecuteDelete).toHaveBeenCalledWith({ avatar: { userId } });
			expect(result).toEqual({ userId: '123', success: true });
			expect(loading).toBe(false);
			expect(error).toBeNull();
		});

		it('Should throw an error if avatar deletion fails', async () => {
			const mockError = new Error('Delete avatar failed');
			const mockExecuteDelete = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockExecuteDelete,
				loading: false,
				error: mockError,
			});

			const { executeDelete, loading, error } = deleteAvatar(userId);
			await expect(executeDelete()).rejects.toThrow('Delete avatar failed');
			expect(mockExecuteDelete).toHaveBeenCalledWith({ avatar: { userId } });
			expect(loading).toBe(false);
			expect(error).toEqual(mockError);
		});
	});

	describe('getProfileSkills', () => {
		const userId = '123';

		it('Should successfully get skills of profile', async () => {
			const mockQuery = vi.fn().mockResolvedValueOnce({
				data: { profile: { skills: ['JavaScript', 'TypeScript', 'Vue'] } },
			});

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { skills, error } = await getProfileSkills(userId);
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId },
				fetchPolicy: 'no-cache',
			});
			expect(skills).toEqual(['JavaScript', 'TypeScript', 'Vue']);
			expect(error).toBeNull();
		});

		it('Should return an empty list and an error if the request fails', async () => {
			const mockError = new Error('Query failed');
			const mockQuery = vi.fn().mockRejectedValueOnce(mockError);

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { skills, error } = await getProfileSkills(userId);
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId },
				fetchPolicy: 'no-cache',
			});
			expect(skills).toEqual([]);
			expect(error).toEqual(mockError);
		});
	});

	describe('getSkillCategories', () => {
		it('Should successfully return skills categories', async () => {
			const mockQuery = vi.fn().mockResolvedValueOnce({
				data: { skillCategories: ['Development', 'Design', 'Marketing'] },
			});

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { categories, error } = await getSkillCategories();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(categories).toEqual(['Development', 'Design', 'Marketing']);
			expect(error).toBeNull();
		});

		it('Should return an empty list and an error if the request fails', async () => {
			const mockError = new Error('Query failed');
			const mockQuery = vi.fn().mockRejectedValueOnce(mockError);

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { categories, error } = await getSkillCategories();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(categories).toEqual([]);
			expect(error).toEqual(mockError);
		});
	});

	describe('getAllSkills', () => {
		it('Should successfully return list of skills', async () => {
			const mockQuery = vi.fn().mockResolvedValueOnce({
				data: { skills: ['JavaScript', 'TypeScript', 'Vue'] },
			});

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { skills, error } = await getAllSkills();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(skills).toEqual(['JavaScript', 'TypeScript', 'Vue']);
			expect(error).toBeNull();
		});

		it('Should return an empty list and an error if the request fails', async () => {
			const mockError = new Error('Query failed');
			const mockQuery = vi.fn().mockRejectedValueOnce(mockError);

			(useApolloClient as any).mockReturnValue({
				client: { query: mockQuery },
			});

			const { skills, error } = await getAllSkills();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(skills).toEqual([]);
			expect(error).toEqual(mockError);
		});
	});

	describe('updateProfileSkill', () => {
		const skill = {
			userId: '123',
			name: 'JavaScript',
			categoryId: '1',
			mastery: 'Advanced' as SkillLevel,
		};
		it('Should successfully update skills in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { updateProfileSkill: true },
			});
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeUpdate } = updateProfileSkill(skill);
			const result = await executeUpdate();
			expect(mockMutation).toHaveBeenCalledWith({
				skill,
			});
			expect(result).toBe(true);
		});

		it('Should throw an error when a skill update fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeUpdate } = updateProfileSkill(skill);
			await expect(executeUpdate()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				skill,
			});
		});
	});

	describe('addProfileSkill', () => {
		const skill = {
			userId: '123',
			name: 'TypeScript',
			categoryId: '1',
			mastery: 'Advanced' as SkillLevel,
		};
		it('Should successfully add the skill in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { addProfileSkill: true },
			});

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeAdd } = addProfileSkill(skill);
			const result = await executeAdd();
			expect(mockMutation).toHaveBeenCalledWith({
				skill,
			});
			expect(result).toBe(true);
		});

		it('Should throw an error if adding a skill fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeAdd } = addProfileSkill(skill);
			await expect(executeAdd()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				skill,
			});
		});
	});

	describe('deleteProfileSkill', () => {
		it('Should successfully delete skill in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { deleteProfileSkill: true },
			});

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const userId = '123';
			const skillNames = ['JavaScript', 'Vue'];

			const { executeDelete } = deleteProfileSkill(userId, skillNames);
			const result = await executeDelete();
			expect(mockMutation).toHaveBeenCalledWith({
				skill: { userId: '123', name: ['JavaScript', 'Vue'] },
			});
			expect(result).toBe(true);
		});

		it('Should throw an error if deleting skills fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const userId = '123';
			const skillNames = ['JavaScript', 'Vue'];

			const { executeDelete } = deleteProfileSkill(userId, skillNames);
			await expect(executeDelete()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				skill: { userId: '123', name: ['JavaScript', 'Vue'] },
			});
		});
	});

	describe('getProfileLanguages', () => {
		const userId = '123';
		it('Should successfully get profile languages', async () => {
			const mockQuery = vi.fn().mockResolvedValueOnce({
				data: { profile: { languages: ['English', 'Spanish', 'French'] } },
			});

			(useApolloClient as any).mockReturnValue({
				client: {
					query: mockQuery,
				},
			});
			const result = await getProfileLanguages(userId);
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId },
				fetchPolicy: 'no-cache',
			});
			expect(result.languages).toEqual(['English', 'Spanish', 'French']);
			expect(result.error).toBeNull();
		});

		it('Should return an error if the request fails', async () => {
			const mockError = new Error('Network error');
			const mockQuery = vi.fn().mockRejectedValueOnce(mockError);

			(useApolloClient as any).mockReturnValue({
				client: {
					query: mockQuery,
				},
			});
			const result = await getProfileLanguages(userId);
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId },
				fetchPolicy: 'no-cache',
			});
			expect(result.languages).toEqual([]);
			expect(result.error).toBe(mockError);
		});
	});

	describe('getAllLanguages', () => {
		it('Should successfully get all languages', async () => {
			const mockQuery = vi.fn().mockResolvedValueOnce({
				data: { languages: ['English', 'Spanish', 'French'] },
			});

			(useApolloClient as any).mockReturnValue({
				client: {
					query: mockQuery,
				},
			});
			const result = await getAllLanguages();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(result.languages).toEqual(['English', 'Spanish', 'French']);
			expect(result.error).toBeNull();
		});

		it('Should return an error if the request fails', async () => {
			const mockError = new Error('Network error');
			const mockQuery = vi.fn().mockRejectedValueOnce(mockError);

			(useApolloClient as any).mockReturnValue({
				client: {
					query: mockQuery,
				},
			});
			const result = await getAllLanguages();
			expect(mockQuery).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(result.languages).toEqual([]);
			expect(result.error).toBe(mockError);
		});
	});

	describe('updateProfileLanguage', () => {
		const language = {
			userId: '1',
			name: 'English',
			proficiency: 'B2' as LanguageLevel,
		};
		it('Should successfully update language in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { updateProfileLanguage: true },
			});
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeUpdate } = updateProfileLanguage(language);
			const result = await executeUpdate();
			expect(mockMutation).toHaveBeenCalledWith({
				language: language,
			});
			expect(result).toBe(true);
		});

		it('Should show an error if updating fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);

			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeUpdate } = updateProfileLanguage(language);
			await expect(executeUpdate()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				language: language,
			});
		});
	});

	describe('addProfileLanguage', () => {
		const language = {
			userId: '1',
			name: 'English',
			proficiency: 'B2' as LanguageLevel,
		};
		it('Should successfully add language in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { addProfileLanguage: true },
			});
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeAdd } = addProfileLanguage(language);
			const result = await executeAdd();

			expect(mockMutation).toHaveBeenCalledWith({
				language: language,
			});
			expect(result).toBe(true);
		});

		it('Should show an error if adding fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeAdd } = addProfileLanguage(language);

			await expect(executeAdd()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				language: language,
			});
		});
	});

	describe('deleteProfileLanguage', () => {
		it('Should successfully delete language in the user profile', async () => {
			const mockMutation = vi.fn().mockResolvedValueOnce({
				data: { deleteProfileLanguage: true },
			});
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeDelete } = deleteProfileLanguage('1', ['English']);
			const result = await executeDelete();

			expect(mockMutation).toHaveBeenCalledWith({
				language: { userId: '1', name: ['English'] },
			});
			expect(result).toBe(true);
		});

		it('Should throw an error if deletion fails', async () => {
			const mockError = new Error('Mutation failed');
			const mockMutation = vi.fn().mockRejectedValueOnce(mockError);
			(useMutation as any).mockReturnValue({
				mutate: mockMutation,
				loading: false,
				error: null,
			});

			const { executeDelete } = deleteProfileLanguage('1', ['English']);

			await expect(executeDelete()).rejects.toThrow('Mutation failed');
			expect(mockMutation).toHaveBeenCalledWith({
				language: { userId: '1', name: ['English'] },
			});
		});
	});

	describe('getUserFullName', () => {
		it('Should successfully return full name of user', async () => {
			const mockUser = {
				profile: { full_name: 'Test' },
				email: 'test@example.com',
			};
			const mockApolloClient = {
				query: vi.fn().mockResolvedValueOnce({ data: { user: mockUser } }),
			};

			(useApolloClient as any).mockReturnValue({ client: mockApolloClient });

			const result = await getUserFullname('1');

			expect(mockApolloClient.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId: '1' },
				fetchPolicy: 'no-cache',
			});
			expect(result).toEqual({
				fullname: 'Test',
				email: 'test@example.com',
				error: null,
			});
		});

		it('Should return an empty string and an error if the request fails', async () => {
			const mockError = new Error('Network error');
			const mockApolloClient = {
				query: vi.fn().mockRejectedValueOnce(mockError),
			};

			(useApolloClient as any).mockReturnValue({ client: mockApolloClient });

			const result = await getUserFullname('1');

			expect(mockApolloClient.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { userId: '1' },
				fetchPolicy: 'no-cache',
			});
			expect(result).toEqual({ fullname: '', email: '', error: mockError });
		});
	});

	describe('getAllUsers', () => {
		it('Should successfully return list of all users', async () => {
			const mockUsers = [{ id: '1', name: 'John Doe' }];
			const mockApolloClient = {
				query: vi.fn().mockResolvedValueOnce({ data: { users: mockUsers } }),
			};

			(useApolloClient as any).mockReturnValue({ client: mockApolloClient });

			const result = await getAllUsers();

			expect(mockApolloClient.query).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(result).toEqual({ users: mockUsers, error: null });
		});

		it('Should return an empty array and an error if the request fails', async () => {
			const mockError = new Error('Network error');
			const mockApolloClient = {
				query: vi.fn().mockRejectedValueOnce(mockError),
			};

			(useApolloClient as any).mockReturnValue({ client: mockApolloClient });

			const result = await getAllUsers();

			expect(mockApolloClient.query).toHaveBeenCalledWith({
				query: expect.anything(),
			});
			expect(result).toEqual({ users: [], error: mockError });
		});
	});
});
