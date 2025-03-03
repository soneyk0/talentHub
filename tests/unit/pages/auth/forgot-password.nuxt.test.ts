import { mount } from '@vue/test-utils';
import ForgotPasswordPage from '~/pages/auth/forgot-password.vue';

vi.mock('~/components/auth/ForgotPasswordForm.vue', () => ({
	default: {
		name: 'AuthForgotPasswordForm',
		template: '<div data-testid="mock-forgot-password-form">aboba</div>',
	},
}));

describe('forgot password page', () => {
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
});
