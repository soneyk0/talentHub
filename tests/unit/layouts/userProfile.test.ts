import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UserProfileLayout from '~/layouts/userProfile.vue';

vi.mock('vue-router', () => {
	return {
		useRoute: vi.fn(() => ({
			params: { id: '123' },
			path: '/users/123/profile',
		})),
	};
});

describe('User Profile Layout', () => {
	it('renders correctly', () => {
		const wrapper = mount(UserProfileLayout);

		expect(wrapper.find('nav').exists()).toBe(true);
		expect(wrapper.find('div.mt-8').exists()).toBe(true);
	});
});
