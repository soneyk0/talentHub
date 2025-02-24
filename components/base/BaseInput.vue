<template>
	<div
		class="relative w-full flex-grow"
		:style="{ opacity: disabled ? '0.5' : '1' }"
	>
		<slot name="inner-content"></slot>
		<input
			v-if="!hideInput"
			:id="id"
			v-model="enteredValue"
			:type="type"
			:class="[
				'peer h-12 w-full min-w-[100px] border border-gray-6 bg-dark-1 p-3 text-white transition-all duration-200 focus:border-red-5 focus:outline-none',
				disabled ? 'opacity-60' : 'hover:border-white',
			]"
			:autocomplete="autocomplete"
			:placeholder="enteredValue || isFocused ? placeholder : ''"
			:disabled="disabled"
			:readonly="readonly"
			@focus="isFocused = true"
			@blur="isFocused = !!enteredValue"
			@input="onInput"
		/>
		<label
			:class="[
				'pointer-events-none absolute left-1 top-0 origin-[0] text-gray-2 transition-all duration-200 peer-focus:bg-dark-1 peer-focus:text-red-5',
				enteredValue
					? '-translate-x-0 -translate-y-4 scale-75 bg-dark-1 p-1'
					: 'translate-y-0 p-3 peer-focus:-translate-x-0 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:p-1',
			]"
		>
			{{ label }}
		</label>
		<slot name="icon"></slot>
	</div>
</template>

<script setup lang="ts">
	const enteredValue = defineModel<string>();

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'text',
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		hideInput: {
			type: Boolean,
			default: false,
		},
		placeholder: { type: String, default: '' },
		autocomplete: { type: String, default: 'off' },
		disabled: { type: Boolean, default: false },
	});

	const emit = defineEmits(['inputValue']);

	const onInput = () => {
		emit('inputValue', enteredValue.value);
	};
	const isFocused = ref(false);
</script>
