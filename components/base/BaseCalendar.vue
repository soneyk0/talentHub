<template>
	<div class="relative">
		<VueDatePicker
			v-model="selectedDate"
			:enable-time-picker="false"
			:max-date="maxDate"
			auto-apply
			@update:model-value="onSelectDate"
		>
			<template #dp-input="{ value }">
				<BaseInput
					id="date"
					:model-value="value"
					:label="label"
					:readonly="true"
				></BaseInput>
				<IconsCalendar class="input-slot-image" color="white" />
			</template>
		</VueDatePicker>
	</div>
</template>

<script setup lang="ts">
	import VueDatePicker from '@vuepic/vue-datepicker';

	const props = defineProps({
		label: {
			type: String,
			required: true,
		},
		modelValue: {
			type: String,
			default: null,
		},
		maxDate: {
			type: String,
			default: '',
		},
	});

	const onSelectDate = (date: Date) => {
		emit('update:modelValue', date.toISOString());
	};

	const selectedDate = ref<string>(props.modelValue || '');

	const emit = defineEmits(['update:modelValue']);

	watch(
		() => props.modelValue,
		(newValue) => {
			selectedDate.value = newValue;
		}
	);
</script>

<style scoped>
	.cursor-pointer {
		cursor: pointer;
	}

	.my-calendar .vc-weekday-1,
	.my-calendar .vc-weekday-7 {
		color: #6366f1;
	}

	.input-slot-image {
		position: absolute;
		right: 0;
		top: 0;
		height: 20px;
		margin-top: 13px;
		margin-right: 35px;
	}
</style>
