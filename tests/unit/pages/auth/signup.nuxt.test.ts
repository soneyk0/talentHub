import { mount } from '@vue/test-utils';
import SignupPage from '~/pages/auth/signup.vue';

vi.mock('~/components/auth/SignupForm.vue', () => ({
	default: {
		name: 'AuthSignupForm',
		template: '<div data-testid="mock-signup-form">boba</div>',
	},
}));

describe('login page', () => {
	it('renders the page with AuthSignupForm', () => {
		const wrapper = mount(SignupPage);

		expect(wrapper.exists()).toBe(true);

		const formComponent = wrapper.find('[data-testid="mock-signup-form"]');
		expect(formComponent.exists()).toBe(true);
		expect(formComponent.text()).toBe('boba');
	});
});
