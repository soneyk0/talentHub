<template>
	<BaseButton
		:variant="variant"
		:color="color"
		:disabled="disabled"
		:type="type"
		class="relative flex max-w-[284px] items-center justify-start gap-4 overflow-hidden"
	>
		<div
			class="relative flex h-8 w-24 items-center justify-start text-base font-light"
			:class="levelPropClass || levelColorClass"
		>
			{{ level }}
		</div>

		<div class="relative flex w-full items-center justify-start text-base">
			<slot />
		</div>
	</BaseButton>
</template>

<script setup lang="ts">
	type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

	const props = defineProps({
		level: {
			type: String as () => LanguageLevel,
			required: true,
			validator: (value: string) =>
				['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'].includes(value),
		},
		variant: {
			type: String as () => 'contained' | 'outlined' | 'text',
			default: 'text',
		},
		color: {
			type: String as () => 'primary' | 'secondary',
			default: 'secondary',
		},
		type: {
			type: String as () => 'button' | 'submit' | 'reset',
			default: 'button',
		},
		levelPropClass: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	});

	const levelColorClass = computed(() => {
		switch (props.level) {
			case 'Native':
				return 'text-red-500';
			case 'C2':
				return 'text-yellow-500';
			case 'C1':
				return 'text-yellow-500';
			case 'B2':
				return 'text-green-500';
			case 'B1':
				return 'text-blue-500';
			default:
				return 'text-gray-400';
		}
	});
</script>
