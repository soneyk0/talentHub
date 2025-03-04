import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ResetPasswordPage from '~/pages/reset-password.vue';
import { resetPassword } from '~/services/auth';

vi.mock('~/services/auth', () => ({
	resetPassword: vi.fn(),
}));

const mockRouter = {
	push: vi.fn(),
};
const mockRoute = {
	query: {
		token: 'test-token-123',
	},
};

mockNuxtImport('useRouter', () => {
	return () => mockRouter;
});

mockNuxtImport('useRoute', () => {
	return () => mockRoute;
});

describe('ResetPasswordPage', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(async () => {
		vi.clearAllMocks();

		vi.mocked(resetPassword).mockReset();

		wrapper = mount(ResetPasswordPage, {
			global: {
				stubs: {
					BaseForm: {
						template: '<div><slot name="main" /><slot name="footer" /></div>',
						emits: ['submit'],
					},
					BaseInput: {
						template:
							'<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
						props: ['modelValue', 'type', 'placeholder', 'required', 'label'],
						emits: ['update:modelValue'],
					},
					BaseButton: {
						template:
							'<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
						props: ['variant', 'color', 'type', 'disabled'],
						emits: ['click'],
					},
				},
			},
		});
	});

	it('renders correctly', () => {
		expect(wrapper.find('input').exists()).toBe(true);
		expect(wrapper.find('button').exists()).toBe(true);
	});

	it('disables submit button when password is empty', async () => {
		const submitButton = wrapper.findAll('button')[0];
		expect(submitButton.attributes('disabled')).toBeDefined();
	});

	it('enables submit button when password is entered', async () => {
		await wrapper.find('input').setValue('newpassword123');
		const submitButton = wrapper.findAll('button')[0];
		expect(submitButton.attributes('disabled')).toBeUndefined();
	});

	it('calls resetPassword service with correct parameters on submit', async () => {
		vi.mocked(resetPassword).mockResolvedValue({ success: true });

		await wrapper.find('input').setValue('newpassword123');

		await wrapper.vm.handleSubmit();

		expect(resetPassword).toHaveBeenCalledWith(
			'newpassword123',
			'test-token-123'
		);
	});

	it('redirects to login page after successful password reset', async () => {
		vi.mocked(resetPassword).mockResolvedValue({ success: true });

		await wrapper.find('input').setValue('newpassword123');

		await wrapper.vm.handleSubmit();

		expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
	});

	it('prevents multiple submissions while request is in progress', async () => {
		let resolvePromise: (value: any) => void;
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		vi.mocked(resetPassword).mockReturnValue(promise);

		await wrapper.find('input').setValue('newpassword123');

		wrapper.vm.handleSubmit();
		wrapper.vm.handleSubmit();

		expect(resetPassword).toHaveBeenCalledTimes(1);
	});
});
