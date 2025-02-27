import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OpenEye from '~/components/icons/OpenEye.vue';

describe('OpenEye icon', () => {
	it('renders the icon with the given color', () => {
		const wrapper = mount(OpenEye, {
			props: { color: 'blue' },
		});

		const svgElement = wrapper.find('svg');
		expect(svgElement.exists()).toBe(true);
		expect(svgElement.attributes('style')).toContain('fill: blue');
	});
});
