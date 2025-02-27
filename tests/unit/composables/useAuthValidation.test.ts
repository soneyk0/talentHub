import { describe } from 'vitest';

describe('useAuthValidation composable', () => {
	test('validates required email', async () => {
		const { form, $v } = useAuthValidation({});

		await $v.value.$validate();
		expect($v.value.email.$error).toBe(true);

		form.value.email = 'ab123@cdn.com';
		await $v.value.$validate();
		expect($v.value.email.$error).toBe(false);
	});

	test('validates password with minLength', async () => {
		const { form, $v } = useAuthValidation({ passwordMinLength: 6 });

		form.value.password = 'short';
		await $v.value.$validate();
		expect($v.value.password.$error).toBe(true);

		form.value.password = 'longlong';
		await $v.value.$validate();
		expect($v.value.password.$error).toBe(false);
	});
});
