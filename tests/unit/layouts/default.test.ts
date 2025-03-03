import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DefaultLayout from '~/layouts/default.vue';

describe('Default Layout', () => {
	it('renders correctly', () => {
		const slotContent = '<div data-test="slot-content">Slot Content</div>';
		const wrapper = mount(DefaultLayout, {
			slots: {
				default: slotContent,
			},
		});

		expect(wrapper.vm).toBeTruthy();

		expect(wrapper.find('[data-test="slot-content"]').exists()).toBe(true);
	});
});
