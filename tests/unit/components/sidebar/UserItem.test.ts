import UserItem from '@/components/sidebar/UserItem.vue';
import { mount } from '@vue/test-utils';

describe('SidebarUserItem', () => {
	it('should render the user name', () => {
		const item = {
			text: 'User Name',
			link: '/profile',
			photo: 'profile-pic-url',
		};

		const wrapper = mount(UserItem, {
			props: { item, isCollapsed: false },
		});
		expect(wrapper.text()).toContain('User Name');
	});

	it('should toggle dropdown menu when clicked', async () => {
		const item = { text: 'User Name', link: '/profile' };
		const wrapper = mount(UserItem, {
			props: { item, isCollapsed: false },
		});
		expect(wrapper.find('.absolute').exists()).toBe(false);
		await wrapper.find('[data-tested="open"]').trigger('click');
		expect(wrapper.find('.absolute').exists()).toBe(true);
		await wrapper.find('[data-tested="open"]').trigger('click');
		expect(wrapper.find('.absolute').exists()).toBe(false);
	});

	it('should render profile icon inside the Profile button', async () => {
		const item = { text: 'User Name', link: '/profile' };
		const wrapper = mount(UserItem, {
			props: { item, isCollapsed: false },
		});

		await wrapper.find('[data-tested="open"]').trigger('click');
		const profileButton = wrapper.findAll('button')[0];
		const profileIcon = profileButton.find('svg');
		expect(profileIcon.exists()).toBe(true);
	});

	it('should render settings icon inside the Settings button', async () => {
		const item = { text: 'User Name', link: '/profile' };
		const wrapper = mount(UserItem, {
			props: { item, isCollapsed: false },
		});

		await wrapper.find('[data-tested="open"]').trigger('click');
		const settingsButton = wrapper.findAll('button')[1];
		const settingsIcon = settingsButton.find('svg');
		expect(settingsIcon.exists()).toBe(true);
	});

	it('should render logout icon inside the Logout button', async () => {
		const item = { text: 'User Name', link: '/profile' };
		const wrapper = mount(UserItem, {
			props: { item, isCollapsed: false },
		});

		await wrapper.find('[data-tested="open"]').trigger('click');
		const logoutButton = wrapper.findAll('button')[2];
		const logoutIcon = logoutButton.find('svg');
		expect(logoutIcon.exists()).toBe(true);
	});
});
