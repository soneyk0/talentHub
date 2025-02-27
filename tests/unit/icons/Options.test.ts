import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Options from '~/components/icons/Options.vue';

describe('Options icon', () => {
	it('renders the icon with the given color and width', () => {
		const wrapper = mount(Options, {
			props: { color: 'red', width: '24px' },
		});

		const svgElement = wrapper.find('svg');
		expect(svgElement.exists()).toBe(true);
		expect(svgElement.attributes('style')).toContain('fill: red');
		expect(svgElement.attributes('width')).toBe('24px');
	});
});
