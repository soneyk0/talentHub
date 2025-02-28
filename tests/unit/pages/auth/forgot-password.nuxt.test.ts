import { mount } from '@vue/test-utils';
import ForgotPasswordPage from '~/pages/auth/forgot-password.vue';

vi.mock('~/components/auth/ForgotPasswordForm.vue', () => ({
	default: {
		name: 'AuthForgotPasswordForm',
		template: '<div data-testid="mock-forgot-password-form">aboba</div>',
	},
}));

// const mockDefinePageMeta = vi.fn();
// vi.mock('#imports', () => {
// 	return {
// 		definePageMeta: mockDefinePageMeta,
// 	};
// });

describe('forgot password page', () => {
	// beforeEach(() => {
	// 	mockDefinePageMeta.mockClear();
	// });

	it('renders the page with AuthForgotPasswordForm', () => {
		const wrapper = mount(ForgotPasswordPage);

		expect(wrapper.exists()).toBe(true);

		const formComponent = wrapper.find(
			'[data-testid="mock-forgot-password-form"]'
		);
		console.log(wrapper.html());
		expect(formComponent.exists()).toBe(true);
		expect(formComponent.text()).toBe('aboba');
	});

	// it('defines the correct page meta', () => {
	// 	const wrapper = mount(ForgotPasswordPage);
	// 	expect(mockDefinePageMeta).toBeCalledTimes(1);
	// 	expect(mockDefinePageMeta).toBeCalledWith({
	// 		layout: 'auth',
	// 	});
	// });
});
