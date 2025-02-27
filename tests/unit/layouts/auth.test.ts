import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AuthLayout from '~/layouts/auth.vue';

describe('Auth Layout', () => {
	it('renders correctly', () => {
		const slotContent = '<div data-test="slot-content">Slot Content</div>';
		const wrapper = mount(AuthLayout, {
			slots: {
				default: slotContent,
			},
		});

		expect(wrapper.find('div').exists()).toBe(true);
		expect(wrapper.find('[data-test="slot-content"]').exists()).toBe(true);
		expect(wrapper.find('div.flex.min-h-screen').exists()).toBe(true);
	});
});
