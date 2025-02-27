import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import BackArrow from '~/components/icons/BackArrow.vue';

describe('BackArrow', () => {
	it('should apply the correct width and color styles from props', () => {
		const wrapper = mount(BackArrow, {
			props: {
				isToggled: false,
				color: 'red',
				width: '24px',
			},
		});
		expect(wrapper.find('svg').attributes('width')).toBe('24px');
		expect(wrapper.find('svg').attributes('style')).toContain('stroke: red');
	});

	it('should apply rotate-180 class when isToggled is true', async () => {
		const wrapper = mount(BackArrow, {
			props: {
				isToggled: false,
				color: 'blue',
				width: '20px',
			},
		});
		expect(wrapper.find('svg').classes()).not.toContain('rotate-180');
		await wrapper.setProps({ isToggled: true });
		expect(wrapper.find('svg').classes()).toContain('rotate-180');
	});

	it('should have correct path d attribute', () => {
		const wrapper = mount(BackArrow, {
			props: {
				isToggled: false,
				color: 'green',
				width: '30px',
			},
		});
		expect(wrapper.find('path').attributes('d')).toBe('M15 19l-7-7 7-7');
	});
});
