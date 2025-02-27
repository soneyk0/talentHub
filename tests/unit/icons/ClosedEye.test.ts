import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ClosedEye from '~/components/icons/ClosedEye.vue';

describe('ClosedEye icon', () => {
	it('renders the icon with the given color', () => {
		const wrapper = mount(ClosedEye, {
			props: { color: 'blue' },
		});

		const svgElement = wrapper.find('svg');
		expect(svgElement.exists()).toBe(true);
		expect(svgElement.attributes('style')).toContain('fill: blue');
	});
});
