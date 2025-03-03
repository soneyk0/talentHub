import { mount } from '@vue/test-utils';
import LoginPage from '~/pages/auth/login.vue';

vi.mock('~/components/auth/LoginForm.vue', () => ({
	default: {
		name: 'AuthLoginForm',
		template: '<div data-testid="mock-login-form">boba</div>',
	},
}));

describe('login page', () => {
	it('renders the page with AuthLoginForm', () => {
		const wrapper = mount(LoginPage);

		expect(wrapper.exists()).toBe(true);

		const formComponent = wrapper.find('[data-testid="mock-login-form"]');
		expect(formComponent.exists()).toBe(true);
		expect(formComponent.text()).toBe('boba');
	});
});
