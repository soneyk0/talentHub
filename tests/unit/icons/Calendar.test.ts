import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Calendar from '~/components/icons/Calendar.vue';

describe('CalendarIcon.vue', () => {
	it('renders the icon with the given color', () => {
		const wrapper = mount(Calendar, {
			props: { color: 'red' },
		});

		const svgElement = wrapper.find('[data-testid="CalendarIcon"]');

		// Проверяем, что элемент найден
		expect(svgElement.exists()).toBe(true);

		// Проверяем, что fill соответствует переданному цвету
		expect(svgElement.attributes('style')).toContain('fill: red');
	});
});
