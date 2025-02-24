<template>
	<tr class="w-full text-sm text-white">
		<td
			v-for="(item, key) in displayedFields"
			:key="key"
			:class="['custom-column py-4 pr-8', displayedFields[key].class]"
		>
			{{ item.value }}
		</td>
		<td class="py-4 pr-2">
			<div
				ref="optionsContainer"
				class="relative"
				@click="showOptions"
				@mouseleave="hideOptions"
			>
				<ButtonsOptions is-toggled color="var(--color-white)" />

				<TableOptions
					v-if="optionsVisible"
					class="absolute right-0 z-10 -mt-11 w-28 rounded-lg border-dark-4 bg-dark-4 py-2 shadow-lg"
					:class="optionsPosition"
					:buttons="[
						{ label: 'Update project', event: 'updateClick' },
						{ label: 'Remove project', event: 'removeClick' },
					]"
					@update-click="$emit('onEditProject')"
					@remove-click="$emit('onDeleteProject')"
				/>
			</div>
		</td>
	</tr>
	<tr class="w-full border-b border-gray-8 font-medium">
		<td colspan="4" class="pr-8">
			<div class="description mb-3 text-gray-3">
				{{ props.row.description }}
			</div>
			<div v-if="!!props.row.responsibilities?.[0]">
				<div
					v-for="(item, index) in props.row.responsibilities"
					:key="index"
					class="responsibilities mb-3 rounded-full border border-gray-8 bg-gray-8 px-2 py-1 text-white"
				>
					{{ item }}
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	import type { Row } from '~/global';

	const router = useRouter();
	const props = defineProps<{
		row: Row;
		tableContainer: HTMLElement | null;
	}>();

	const emit = defineEmits(['onDeleteProject', 'onEditProject']);

	const optionsVisible = ref(false);
	const optionsContainer = ref<HTMLElement | null>(null);
	const optionsPosition = ref('top-20');

	const displayedFields = computed(() => {
		return {
			name: { value: props.row.name, class: 'small-column' },
			domain: { value: props.row.domain, class: 'medium-column' },
			start_date: { value: props.row.start_date, class: 'medium-column' },
			end_date: { value: props.row.end_date, class: 'medium-column' },
		};
	});

	const showOptions = async () => {
		optionsVisible.value = true;
		await nextTick();
		if (optionsContainer.value && props.tableContainer) {
			const rect = optionsContainer.value.getBoundingClientRect();
			const tableRect = props.tableContainer.getBoundingClientRect();
			const spaceBelow = tableRect.bottom - rect.bottom;

			optionsPosition.value = spaceBelow < 50 ? 'bottom-5' : 'top-0)';
		}
	};

	const hideOptions = () => {
		optionsVisible.value = false;
	};
</script>

<style scoped>
	.small-column {
		min-width: 160px;
		max-width: 200px;
	}

	.medium-column {
		min-width: 170px;
		max-width: 200px;
	}

	.big-column {
		min-width: 255px;
		max-width: 260px;
	}

	.custom-column {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		width: 100%;
		word-wrap: break-word;
		white-space: normal;
	}

	.responsibilities {
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		word-wrap: break-word;
		white-space: normal;
	}
</style>
