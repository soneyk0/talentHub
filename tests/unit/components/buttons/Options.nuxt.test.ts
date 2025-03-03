import { mountSuspended } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OptionsButton from '~/components/buttons/Options.vue';

vi.mock('~/components/icons/Options.vue', () => ({
	default: {
		name: 'IconsOptions',
		props: ['color', 'width'],
		template: '<svg :data-color="color" :data-width="width"></svg>',
	},
}));

describe('OptionsButton', () => {
	it('renders with the correct props', async () => {
		const color = '#FF0000';
		const wrapper = await mountSuspended(OptionsButton, {
			props: {
				color,
			},
		});

		const button = wrapper.find('button');
		expect(button.exists()).toBe(true);
		expect(button.classes()).toContain('flex');

		const icon = wrapper.find('svg');
		expect(icon.attributes('data-color')).toBe(color);
		expect(icon.attributes('data-width')).toBe('22px');
	});

	it('emits a click event when clicked', async () => {
		const wrapper = mount(OptionsButton, {
			props: {
				color: '#FF0000',
			},
		});

		await wrapper.find('button').trigger('click');

		expect(wrapper.emitted()).toHaveProperty('click');
		expect(wrapper.emitted().click).toHaveLength(1);
	});

	it('applies hover styles correctly', async () => {
		const wrapper = mount(OptionsButton, {
			props: {
				color: '#FF0000',
			},
		});

		const button = wrapper.find('button');
		expect(button.classes()).toContain('hover:bg-dark-4');
	});
});
