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
		console.log('HTML:', wrapper.html());

		expect(wrapper.find('aside').exists()).toBe(true);
		expect(wrapper.find('header').exists()).toBe(true);
		expect(wrapper.find('[data-test="slot-content"]').exists()).toBe(true);

		expect(wrapper.find('div.flex.min-h-screen').exists()).toBe(true);
		expect(wrapper.find('main.flex-1').exists()).toBe(true);
	});
});
