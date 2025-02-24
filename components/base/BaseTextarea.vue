<template>
	<div
		class="relative w-full flex-grow"
		:style="{
			opacity: disabled ? '0.5' : '1',
		}"
	>
		<textarea
			:id="id"
			ref="textareaRef"
			v-model="enteredValue"
			:class="[
				'peer h-auto w-full min-w-[220px] resize-none overflow-hidden border border-gray-6 bg-dark-1 p-3 text-white transition-all duration-200 focus:border-red-5 focus:outline-none',
				disabled ? '' : 'hover:border-white',
			]"
			:placeholder="enteredValue || isFocused ? placeholder : ''"
			:label="label"
			:rows="rows"
			:disabled="disabled"
			@focus="isFocused = true"
			@blur="isFocused = !!enteredValue"
			@input="autoResize"
		></textarea>
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
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		id: string;
		label: string;
		placeholder?: string;
		rows: number;
		disabled: boolean;
	}>();
	const isFocused = ref(false);
	const enteredValue = defineModel<string>();
	const textareaRef = ref<HTMLTextAreaElement | null>(null);

	const autoResize = () => {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto'; // Сброс высоты перед измерением
		textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем новую высоту
	};

	watch(enteredValue, () => {
		nextTick(() => {
			autoResize();
		});
	});
</script>
