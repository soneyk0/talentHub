<template>
	<div>
		<BaseModal
			v-model:is-open="isOpen"
			:title="$t('Update user')"
			:confirm-text="$t('Update')"
			max-width-class="max-w-[900px]"
			:has-changes="hasChanges"
			@confirm="handleSubmit"
		>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div class="space-y-2">
					<BaseInput
						id="email"
						v-model="email"
						:label="$t('Email')"
						:type="'email'"
						:disabled="true"
					/>
				</div>
				<div class="space-y-2">
					<BaseInput
						id="password"
						v-model="password"
						:label="$t('Password')"
						:type="'password'"
						:disabled="true"
					/>
				</div>

				<div class="space-y-2">
					<BaseInput
						id="firstName"
						v-model="firstName"
						:label="$t('First Name')"
					/>
				</div>
				<div class="space-y-2">
					<BaseInput
						id="lastName"
						v-model="lastName"
						:label="$t('Last Name')"
					/>
				</div>

				<div class="space-y-2">
					<BaseDropdown
						id="department"
						v-model="selectedDepartment"
						:label="$t('Department')"
						:options="departments"
						:default-option-label="$t('No department')"
					/>
				</div>
				<div class="space-y-2">
					<BaseDropdown
						id="position"
						v-model="selectedPosition"
						:label="$t('Position')"
						:options="positions"
						:default-option-label="$t('No position')"
					/>
				</div>

				<div class="space-y-2 md:col-span-1">
					<BaseDropdown
						id="role"
						v-model="role"
						:label="$t('Role')"
						:options="roles"
						:disabled="true"
					/>
				</div>
			</div>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
	import type { Option } from '~/global';
	import {
		getAllDepartments,
		getAllPositions,
		getUserById,
		updateProfile,
		updateUser,
	} from '~/services/user';
	import { showErrorToast, showSuccessToast } from '~/utils/toast/toast';

	const isOpen = defineModel<boolean>('isOpen', { default: false });
	const { t } = useI18n();

	const firstName = ref('');
	const lastName = ref('');
	const email = ref('');
	const password = ref('000000000');
	const role = ref<Option>({ value: '', label: '' });
	const avatar = ref('');
	const selectedDepartment = ref<Option>({ value: '', label: '' });
	const selectedPosition = ref<Option>({ value: '', label: '' });
	const { updateCurrentUserData, getCurrentUserId } = useCurrentUser();
	const userId = ref(getCurrentUserId.value);
	const initialValues = ref({
		firstName: '',
		lastName: '',
		selectedDepartment: { value: '', label: '' },
		selectedPosition: { value: '', label: '' },
	});

	const departments = ref<Option[]>([]);
	const positions = ref<Option[]>([]);
	const roles = ref<Option[]>([
		{ value: 'Employee', label: t('Employee') },
		{ value: 'Admin', label: t('Admin') },
	]);
	const loadOptions = async () => {
		try {
			const [deptData, posData] = await Promise.all([
				getAllDepartments(),
				getAllPositions(),
			]);
			departments.value = deptData.departments.map((dept) => ({
				value: dept.id,
				label: dept.name,
			}));

			positions.value = posData.positions.map((pos) => ({
				value: pos.id,
				label: pos.name,
			}));
		} catch (error) {
			showErrorToast('Failed to load options');
		}
	};

	const loadUserData = async () => {
		try {
			const { user } = await getUserById(userId.value!, true);
			if (user) {
				firstName.value = user.profile.first_name;
				lastName.value = user.profile.last_name;
				email.value = user.email;
				avatar.value = user.profile.avatar;
				selectedDepartment.value = {
					value: user.department?.id || '',
					label: user.department?.name || '',
				};
				selectedPosition.value = {
					value: user.position?.id || '',
					label: user.position?.name || '',
				};
				role.value = {
					value: user.role || '',
					label: user.role || '',
				};

				initialValues.value = {
					firstName: firstName.value,
					lastName: lastName.value,
					selectedDepartment: { ...selectedDepartment.value },
					selectedPosition: { ...selectedPosition.value },
				};
			}
		} catch (error) {
			showErrorToast('Failed to load user data');
		}
	};

	watch(
		() => isOpen.value,
		async (newValue) => {
			if (newValue) {
				await Promise.all([loadOptions(), loadUserData()]);
			}
		}
	);

	const hasChanges = computed(() => {
		return (
			firstName.value !== initialValues.value.firstName ||
			lastName.value !== initialValues.value.lastName ||
			selectedDepartment.value.value !==
				initialValues.value.selectedDepartment.value ||
			selectedPosition.value.value !==
				initialValues.value.selectedPosition.value
		);
	});

	const handleSubmit = async () => {
		try {
			const { executeUpdate: updateUserData } = updateUser({
				userId: userId.value as string,
				departmentId: selectedDepartment.value.value,
				positionId: selectedPosition.value.value,
			});
			const { executeUpdate: updateProfileData } = updateProfile({
				userId: userId.value as string,
				first_name: firstName.value,
				last_name: lastName.value,
			});
			await updateUserData();
			await updateProfileData();

			clearNuxtData(`user-${userId.value}`);

			updateCurrentUserData({
				profile: {
					first_name: firstName.value,
					last_name: lastName.value,
					avatar: avatar.value,
				},
				department: {
					id: selectedDepartment.value.value,
					name: selectedDepartment.value.label,
				},
				position: {
					id: selectedPosition.value.value,
					name: selectedPosition.value.label,
				},
				email: email.value,
			});

			showSuccessToast('Profile updated successfully');
			isOpen.value = false;
		} catch (error) {
			showErrorToast('Failed to update profile');
		}
	};
</script>

<style scoped></style>
