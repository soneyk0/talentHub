import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UploadIcon from '~/components/icons/UploadIcon.vue';

describe('Upload icon', () => {
	it('renders the icon with the given color and width', () => {
		const wrapper = mount(UploadIcon, {
			props: { color: 'red', width: '32px' },
		});

		const svgElement = wrapper.find('svg');
		expect(svgElement.exists()).toBe(true);
		expect(svgElement.attributes('style')).toContain('fill: red');
		expect(svgElement.attributes('width')).toBe('32px');
		expect(svgElement.attributes('min-width')).toBe('32px');
	});
});
