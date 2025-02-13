import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { login } from '~/services/auth';

vi.mock('~/services/auth', () => ({
	login: vi.fn().mockResolvedValue({}),
}));

vi.mock('#app', () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

describe('Login form', () => {
	test('change isSubmitting at runtime', async () => {
		const isSubmitting = ref(false);
		const form = ref({ email: 'test@mail.com', password: '123456' });

		const handleLogin = async () => {
			isSubmitting.value = true;
			try {
				await login(form.value);
			} finally {
				isSubmitting.value = false;
			}
		};

		expect(isSubmitting.value).toBe(false);
		const loginPromise = handleLogin();
		expect(isSubmitting.value).toBe(true);
		await loginPromise;
		expect(isSubmitting.value).toBe(false);
	});

	test('toggles password visibility', () => {
		const isPasswordVisible = ref(false);

		const togglePasswordVisibility = (newValue: boolean) => {
			isPasswordVisible.value = newValue;
		};

		togglePasswordVisibility(true);
		expect(isPasswordVisible.value).toBe(true);

		togglePasswordVisibility(false);
		expect(isPasswordVisible.value).toBe(false);
	});
});
