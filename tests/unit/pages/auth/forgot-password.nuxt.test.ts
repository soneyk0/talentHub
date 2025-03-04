import { mount } from '@vue/test-utils';
import ForgotPasswordPage from '~/pages/auth/forgot-password.vue';

vi.mock('~/components/auth/ForgotPasswordForm.vue', () => ({
	default: {
		name: 'AuthForgotPasswordForm',
		template:
			'<div data-testid="mock-forgot-password-form">Mock Forgot Password Form</div>',
	},
}));

const mockUseNuxtApp = vi.fn().mockReturnValue({
	$layout: 'auth',
});

vi.mock('#imports', async () => {
	const actual = await vi.importActual('#imports');
	return {
		...actual,
		definePageMeta: vi.fn(),
		useNuxtApp: mockUseNuxtApp,
	};
});

describe('forgot password page', () => {
	it('renders the page with AuthForgotPasswordForm', async () => {
		const wrapper = mount(ForgotPasswordPage);

		expect(wrapper.exists()).toBe(true);

		const formComponent = wrapper.find(
			'[data-testid="mock-forgot-password-form"]'
		);
		expect(formComponent.exists()).toBe(true);
		expect(formComponent.text()).toBe('Mock Forgot Password Form');
	});

	it('uses the auth layout', () => {
		mount(ForgotPasswordPage);

		expect(mockUseNuxtApp()).toHaveProperty('$layout', 'auth');
	});
});
