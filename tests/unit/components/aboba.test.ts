import { mountSuspended } from '@nuxt/test-utils/runtime';
import Aboba from '~/components/Aboba.vue';

describe('Aboba', () => {
	it('renders with the correct props', async () => {
		const wrapper = await mountSuspended(Aboba);
		console.log(wrapper.html());
		expect(wrapper.html()).toContain('Aboba');
	});
});
