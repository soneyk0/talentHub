import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Calendar from '~/components/icons/Calendar.vue';

describe('Calendar icon', () => {
	it('renders the icon with the given color', () => {
		const wrapper = mount(Calendar, {
			props: { color: 'red' },
		});

		const svgElement = wrapper.find('[data-testid="CalendarIcon"]');
		expect(svgElement.exists()).toBe(true);
		expect(svgElement.attributes('style')).toContain('fill: red');
	});
});
