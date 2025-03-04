import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CvLayout from '~/layouts/cv.vue';

vi.mock('vue-router', () => {
	return {
		useRoute: vi.fn(() => ({
			params: { id: '123' },
			path: '/cvs/123/details',
		})),
	};
});

describe('Cv Layout', () => {
	it('renders correctly', () => {
		const wrapper = mount(CvLayout);

		expect(wrapper.vm).toBeTruthy();

		expect(wrapper.find('nav').exists()).toBe(true);
	});
});
