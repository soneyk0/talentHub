import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import CVDetailsPage from '~/pages/cvs/[id]/details.vue';
import { getCvById, updateCv } from '~/services/cv';
import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

vi.mock('~/services/cv', () => {
	return {
		getCvById: vi.fn(),
		updateCv: vi.fn(),
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

mockNuxtImport('useRoute', () => {
	return () => ({
		params: { id: 'test-id-1' },
	});
});

const mockCvData = {
	cv: {
		id: 'test-id-1',
		name: 'Test CV',
		education: 'Test Education',
		description: 'Test Description',
	},
};

mockNuxtImport('clearNuxtData', () => {
	return vi.fn();
});

describe('CV details page', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(getCvById).mockResolvedValue({
			cv: mockCvData.cv,
			error: null,
		});

		vi.mocked(updateCv).mockReturnValue({
			executeUpdate: vi.fn().mockResolvedValue(mockCvData),
			loading: ref(false),
			error: ref(null),
		});
	});

	it('renders the form with correct inputs', async () => {
		const wrapper = await mountSuspended(CVDetailsPage);

		expect(wrapper.find('#name').exists()).toBe(true);
		expect(wrapper.find('#education').exists()).toBe(true);
		expect(wrapper.find('#description').exists()).toBe(true);
		expect(wrapper.find('button').exists()).toBe(true);
	});

	it('populates form fields with CV data', async () => {
		mockNuxtImport('useAsyncData', () => {
			return () => ({
				data: { value: { cv: mockCvData.cv } },
				refresh: vi.fn(),
			});
		});
		mockNuxtImport('useNuxtData', () => {
			return () => ({
				data: { value: { cv: mockCvData.cv } },
			});
		});
		const wrapper = await mountSuspended(CVDetailsPage);

		const nameInput = wrapper.find('#name');
		const educationInput = wrapper.find('#education');
		const descriptionInput = wrapper.find('#description');

		expect(nameInput.element.value).toBe('Test CV');
		expect(educationInput.element.value).toBe('Test Education');
		expect(descriptionInput.element.value).toBe('Test Description');
	});

	it('disables update button when no changes are made', async () => {
		const wrapper = await mountSuspended(CVDetailsPage);

		const button = wrapper.find('button');
		expect(button.attributes('disabled')).toBeDefined();
	});

	it('enables update button when changes are made', async () => {
		const wrapper = await mountSuspended(CVDetailsPage);

		await wrapper.find('#name').setValue('new CV Name');

		const button = wrapper.find('button');
		expect(button.attributes('disabled')).toBeUndefined();
	});

	it('calls updateCv service when form is submitted', async () => {
		const mockExecuteUpdate = vi.fn().mockResolvedValue(mockCvData);
		vi.mocked(updateCv).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVDetailsPage);

		await wrapper.find('#name').setValue('Updated CV Name');
		await wrapper.find('#education').setValue('Updated Education');
		await wrapper.find('#description').setValue('Updated Description');

		await wrapper.find('button').trigger('click');

		expect(updateCv).toHaveBeenCalledWith({
			cvId: 'test-id-1',
			name: 'Updated CV Name',
			education: 'Updated Education',
			description: 'Updated Description',
		});

		expect(mockExecuteUpdate).toHaveBeenCalled();

		const { clearNuxtData } = await import('#imports');
		expect(clearNuxtData).toHaveBeenCalledWith(`cv-test-id-1`);

		expect(showSuccessToast).toHaveBeenCalledWith('CV updated successfully');
	});

	it('shows error toast when update fails', async () => {
		const mockExecuteUpdate = vi
			.fn()
			.mockRejectedValue(new Error('Update failed'));

		vi.mocked(updateCv).mockReturnValue({
			executeUpdate: mockExecuteUpdate,
			loading: ref(false),
			error: ref(null),
		});

		const wrapper = await mountSuspended(CVDetailsPage);

		await wrapper.find('#name').setValue('Updated CV Name');

		await wrapper.find('button').trigger('click');

		expect(showErrorToast).toHaveBeenCalledWith('Failed to update CV');
	});
});
