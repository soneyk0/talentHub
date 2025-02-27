import { useMutation, useQuery } from '@vue/apollo-composable';
import { describe, vi } from 'vitest';
import { forgotPassword, login, resetPassword, signUp } from '~/services/auth';

const mockSetCurrentUserId = vi.fn();
const mockReinitializeUser = vi.fn();

vi.mock('@vue/apollo-composable', () => ({
	useMutation: vi.fn(),
	useQuery: vi.fn(),
}));

vi.mock('~/composables/useCurrentUser', () => ({
	useCurrentUser: () => ({
		setCurrentUserId: mockSetCurrentUserId,
		reinitializeUser: mockReinitializeUser,
	}),
}));

describe('auth serivce', () => {
	describe('signUp', () => {
		const mockAuthData = {
			email: 'test@example.com',
			password: 'password123',
		};

		const mockResponse = {
			data: {
				signup: {
					access_token: 'mock-access-token',
					refresh_token: 'mock-refresh-token',
					user: { id: '9123' },
				},
			},
		};

		beforeEach(() => {
			vi.clearAllMocks();
		});

		test('successfuly signs up a user', async () => {
			const mutate = vi.fn().mockResolvedValue(mockResponse);
			vi.mocked(useMutation).mockReturnValue({
				mutate,
			} as any);
			const result = await signUp(mockAuthData);

			expect(mutate).toHaveBeenCalledWith({ auth: mockAuthData });

			expect(mockSetCurrentUserId).toHaveBeenCalledWith('9123');
			expect(mockReinitializeUser).toHaveBeenCalled();

			expect(result).toEqual(mockResponse.data);
		});

		test('handles signup error', async () => {
			const mutate = vi.fn().mockRejectedValue(new Error('Signup failed'));
			vi.mocked(useMutation).mockReturnValue({ mutate });

			await expect(signUp(mockAuthData)).rejects.toThrow('Signup failed');
		});
	});

	describe('login', () => {
		const mockAuthData = {
			email: 'test@example.com',
			password: 'password123',
		};

		const mockResponse = {
			data: {
				login: {
					access_token: 'mock-access-token',
					refresh_token: 'mock-refresh-token',
					user: { id: '9123' },
				},
			},
		};
		test('successfuly logs in a user', async () => {
			let resultCallback: any;
			let errorCallback: any;
			const stop = vi.fn();

			vi.mocked(useQuery).mockReturnValue({
				onResult: vi.fn((callback) => {
					resultCallback = callback;
					return { stop };
				}),
				onError: vi.fn((callback) => {
					errorCallback = callback;
					return { stop };
				}),
				stop,
			});

			const loginPromise = login(mockAuthData);

			resultCallback(mockResponse);

			const result = await loginPromise;

			const accessToken = useCookie('access_token');
			const refreshToken = useCookie('refresh_token');
			expect(accessToken.value).toBe('mock-access-token');
			expect(refreshToken.value).toBe('mock-refresh-token');

			expect(mockSetCurrentUserId).toHaveBeenCalledWith('9123');

			expect(stop).toHaveBeenCalled();

			expect(result).toEqual(mockResponse.data);
		});

		test('handles login error', async () => {
			let errorCallback: any;
			const stop = vi.fn();

			vi.mocked(useQuery).mockReturnValue({
				onResult: vi.fn(),
				onError: vi.fn((callback) => {
					errorCallback = callback;
					return { stop };
				}),
				stop,
			});

			const loginPromise = login(mockAuthData);

			errorCallback(new Error('Login failed'));

			await expect(loginPromise).rejects.toThrow('Login failed');
			expect(stop).toHaveBeenCalled();
		});
	});

	describe('forgotPassword', () => {
		test('successfully sends forgot password request', async () => {
			const mutate = vi.fn().mockResolvedValue({ data: { success: true } });
			vi.mocked(useMutation).mockReturnValue({ mutate });

			await forgotPassword('test@example.com');
			expect(mutate).toHaveBeenCalledWith({
				auth: { email: 'test@example.com' },
			});
		});
	});

	describe('resetPassword', () => {
		test('successfully resets password', async () => {
			const mutate = vi.fn().mockResolvedValue({ data: { success: true } });
			vi.mocked(useMutation).mockReturnValue({ mutate });

			const token = 'reset-token';
			const newPassword = 'newpassword123';

			await resetPassword(newPassword, token);
			expect(mutate).toHaveBeenCalledWith({
				auth: { newPassword },
			});
		});
	});
});
