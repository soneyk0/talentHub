import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import CVIndexPage from '~/pages/cvs/index.vue';
import { createCv, deleteCv, getAllCvs } from '~/services/cv';
import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

vi.mock('~/services/cv', () => {
	return {
		createCv: vi.fn(),
		deleteCv: vi.fn(),
		getAllCvs: vi.fn(),
	};
});

vi.mock('~/utils/toast/toast', () => {
	return {
		showSuccessToast: vi.fn(),
		showErrorToast: vi.fn(),
	};
});

vi.mock('~/components/base/BaseTextarea.vue', () => ({
	default: {
		name: 'BaseTextarea',
		props: ['id', 'modelValue', 'label', 'rows', 'disabled'],
		template: `
      <div>
        <textarea 
          :id="id" 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
        <label>{{ label }}</label>
      </div>
    `,
	},
}));

vi.mock('~/components/base/BaseInput.vue', () => ({
	default: {
		name: 'BaseInput',
		props: ['id', 'modelValue', 'label', 'type'],
		template: `
      <div>
        <input 
          :id="id" 
          :type="type"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <label>{{ label }}</label>
      </div>
    `,
	},
}));

vi.mock('~/components/base/SearchBar.vue', () => ({
	default: {
		name: 'BaseSearchBar',
		props: ['modelValue', 'placeholder'],
		template: `
      <div>
        <input 
          class="search-input"
          :value="modelValue"
          :placeholder="placeholder"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    `,
	},
}));

vi.mock('~/components/base/button/BaseButton.vue', () => ({
	default: {
		name: 'BaseButton',
		props: ['color', 'type', 'variant', 'disabled'],
		template: `
      <button 
        :type="type" 
        :disabled="disabled"
        @click="$emit('click')"
      >
        <slot></slot>
      </button>
    `,
	},
}));

vi.mock('~/components/base/BaseModal.vue', () => ({
	default: {
		name: 'BaseModal',
		props: ['isOpen', 'confirmText', 'cancelText', 'title', 'hasChanges'],
		template: `
      <div v-if="isOpen" class="modal">
        <h2>{{ title }}</h2>
        <div class="modal-content">
          <slot></slot>
        </div>
        <div class="modal-actions">
          <button 
            class="cancel-button" 
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button 
            class="confirm-button" 
            :disabled="!hasChanges"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    `,
		emits: ['update:isOpen', 'confirm', 'cancel'],
	},
}));

vi.mock('~/components/table/index.vue', () => ({
	default: {
		name: 'Table',
		props: ['searchQuery', 'headers', 'rowsData', 'rowComponent'],
		template: `
      <div class="table">
        <div v-for="row in rowsData || []" :key="row.id" class="table-row">
          <div>{{ row.name }}</div>
          <div>{{ row.education }}</div>
          <div>{{ row.email }}</div>
          <button class="delete-button" @click="$emit('onDeleteCV', row)">Delete</button>
        </div>
      </div>
    `,
		emits: ['onDeleteCV'],
	},
}));

const mockRouter = {
	push: vi.fn(),
	replace: vi.fn(),
};

mockNuxtImport('useRouter', () => {
	return () => mockRouter;
});

mockNuxtImport('useCurrentUser', () => {
	return () => ({
		getCurrentUserId: { value: 'test-user-id' },
	});
});

mockNuxtImport('clearNuxtData', () => {
	return vi.fn();
});

const mockCvsData = [
	{
		id: '1',
		name: 'Test CV 1',
		education: 'Test Education 1',
		description: 'Test Description 1',
		user: { email: 'test1@example.com' },
	},
	{
		id: '2',
		name: 'Test CV 2',
		education: 'Test Education 2',
		description: 'Test Description 2',
		user: { email: 'test2@example.com' },
	},
];

describe('CV index page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getAllCvs).mockResolvedValue(mockCvsData);
		vi.mocked(createCv).mockResolvedValue({ id: '3', name: 'New CV' });
		vi.mocked(deleteCv).mockResolvedValue(undefined);

		mockNuxtImport('useAsyncData', () => {
			return () => ({
				data: { value: mockCvsData },
				refresh: vi.fn(),
			});
		});

		mockNuxtImport('useNuxtData', () => {
			return () => ({
				data: { value: mockCvsData },
			});
		});
	});

	it('renders the page with search bar and create button', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		expect(wrapper.find('.search-input').exists()).toBe(true);
		expect(wrapper.find('button').text()).toContain('CREATE CV');
	});

	it('displays CVs in the table', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		const tableRows = wrapper.findAll('.table-row');
		expect(tableRows.length).toBe(2);
		expect(tableRows[0].text()).toContain('Test CV 1');
		expect(tableRows[0].text()).toContain('test1@example.com');
		expect(tableRows[1].text()).toContain('Test CV 2');
		expect(tableRows[1].text()).toContain('test2@example.com');
	});

	it('filters CVs based on search query', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('.search-input').setValue('test1');

		const vm = wrapper.vm;
		expect(wrapper.vm.filteredData.length).toBe(1);
		expect(wrapper.vm.filteredData[0].name).toBe('Test CV 1');
	});

	it('opens create CV modal when add button is clicked', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('button').trigger('click');

		expect(wrapper.find('.modal').exists()).toBe(true);
		expect(wrapper.find('.modal h2').text()).toBe('Create CV');
	});

	it('creates a new CV when form is submitted', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('button').trigger('click');

		await wrapper.find('#name').setValue('New CV Name');
		await wrapper.find('#education').setValue('New Education');
		await wrapper.find('#description').setValue('New Description');

		await wrapper.find('.confirm-button').trigger('click');

		expect(createCv).toHaveBeenCalledWith({
			userId: 'test-user-id',
			name: 'New CV Name',
			education: 'New Education',
			description: 'New Description',
		});

		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith('cvs-test-user-id');
		expect(showSuccessToast).toHaveBeenCalledWith('CV created successfully');
		expect(mockRouter.push).toHaveBeenCalledWith('/cvs/3/details');
	});

	it('shows error toast when CV creation fails', async () => {
		vi.mocked(createCv).mockRejectedValue(new Error('Creation failed'));

		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('button').trigger('click');

		await wrapper.find('#name').setValue('New CV Name');

		await wrapper.find('.confirm-button').trigger('click');
	});

	it('opens delete CV modal when delete button is clicked', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('.delete-button').trigger('click');

		expect(wrapper.find('.modal').exists()).toBe(true);
		expect(wrapper.find('.modal h2').text()).toBe('Delete CV');
	});

	it('deletes a CV when delete is confirmed', async () => {
		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('.delete-button').trigger('click');

		await wrapper.find('.confirm-button').trigger('click');

		expect(deleteCv).toHaveBeenCalledWith('1');
	});

	it('shows error toast when CV deletion fails', async () => {
		vi.mocked(deleteCv).mockRejectedValue(new Error('Deletion failed'));

		const wrapper = await mountSuspended(CVIndexPage);

		await wrapper.find('.delete-button').trigger('click');

		await wrapper.find('.confirm-button').trigger('click');

		expect(showErrorToast).toHaveBeenCalledWith('Error deleting CV');
	});
});
