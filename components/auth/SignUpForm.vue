<template>
	<div class="flex min-h-screen flex-col">
		<AuthTheHeader />
		<div class="flex flex-1 items-center justify-center">
			<BaseForm
				:info-text="$t('Welcome! Sign up to continue')"
				:title="$t('Register now')"
				@submit="handleSignup"
			>
				<template #main>
					<BaseInput
						id="email"
						v-model="form.email"
						type="text"
						placeholder="example@mail.com"
						required
						:label="$t('Email')"
						class="w-screen max-w-[550px]"
						autocomplete="on"
					/>
					<span v-if="$v.email.$error" class="text-red-1">
						{{ $t('Required field') }}
					</span>
					<BaseInput
						id="password"
						v-model="form.password"
						:type="isPasswordVisible ? 'text' : 'password'"
						:placeholder="$t('Enter your password')"
						required
						:label="$t('Password')"
						class="w-screen max-w-[550px]"
					>
						<template #icon>
							<AuthPasswordEyeToggle
								:color="'var(--color-white)'"
								@update:password-visibility="togglePasswordVisibility"
							/>
						</template>
					</BaseInput>
					<span>
						<span
							v-if="$v.password.$error && !$v.password.$model"
							class="text-red-1"
						>
							{{ $t('Required field') }}
						</span>
						<span
							v-if="
								$v.password.$dirty &&
								$v.password.$model &&
								$v.password.minLength.$invalid
							"
							class="text-red-1"
						>
							{{ $t('At least 6 characters') }}
						</span>
					</span>
				</template>
				<template #footer>
					<div class="mb-2">
						<BaseButton
							variant="contained"
							color="primary"
							type="submit"
							:disabled="isSubmitting"
						>
							{{ $t('Create account') }}
						</BaseButton>
					</div>
					<div>
						<NuxtLink to="/auth/login">
							<BaseButton
								variant="text"
								color="secondary"
								type="button"
								class="w-1/2"
							>
								{{ $t('I have an account') }}
							</BaseButton>
						</NuxtLink>
					</div>
				</template>
			</BaseForm>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useRouter } from '#app';
	import { useAuthValidation } from '~/composables/useAuthValidation';
	import { signUp } from '~/services/auth';

	const router = useRouter();
	const isPasswordVisible = ref(false);
	const isSubmitting = ref(false);

	const { form, $v } = useAuthValidation({ passwordMinLength: 6 });

	const handleSignup = async () => {
		isSubmitting.value = true;
		await $v.value.$validate();
		if ($v.value.$error) {
			isSubmitting.value = false;
			return;
		}
		try {
			const data = await signUp(form.value);
			if (data) {
				router.push('/users');
			}
		} finally {
			isSubmitting.value = false;
		}
	};
	const togglePasswordVisibility = (newValue: boolean) => {
		isPasswordVisible.value = newValue;
	};
</script>
