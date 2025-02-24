<template>
	<div
		ref="tableContainer"
		class="max-h-[calc(100vh-0.75rem-90px)] w-full overflow-y-auto"
		@scroll="handleScroll"
	>
		<table class="w-full table-auto overflow-x-auto">
			<TableHead
				:headers="headers"
				:sort-key="sortKey"
				:sort-order="sortOrder"
				@sort="handleSort"
			/>
			<tbody>
				<component
					:is="rowComponent"
					v-for="row in displayedData"
					:key="row.id"
					:row="row"
					:table-container="tableContainer"
					@on-delete-project="$emit('onDeleteProject', row)"
					@on-edit-project="$emit('onEditProject', row)"
				/>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	import TableCvRow from '@/components/table/CvRow.vue';
	import TableProjectRow from '@/components/table/ProjectRow.vue';
	import TableUserRow from '@/components/table/UserRow.vue';
	import type { Row } from '~/global';

	const emit = defineEmits(['onDeleteProject', 'onEditProject']);

	const props = defineProps<{
		headers: { key: string; label: string; isSortable: boolean }[];
		rowsData: Row[];
		searchQuery?: string;
		rowComponent: 'TableUserRow' | 'TableCvRow' | 'TableProjectRow';
	}>();

	const tableContainer = ref<HTMLElement | null>(null);
	const sortKey = ref<string | null>(null);
	const sortOrder = ref<'asc' | 'desc'>('asc');
	const itemsPerPage = 10;
	const loadedCount = ref(itemsPerPage);
	const isLoading = ref(false);
	const displayedData = ref<Row[]>([]);

	const rowComponent = computed(() => {
		const components: Record<
			'TableUserRow' | 'TableCvRow' | 'TableProjectRow',
			typeof TableUserRow | typeof TableCvRow | typeof TableProjectRow
		> = {
			TableUserRow,
			TableCvRow,
			TableProjectRow,
		};
		return components[props.rowComponent];
	});

	const sortedData = computed(() => {
		if (!sortKey.value) return props.rowsData;

		return sortRows([...props.rowsData], sortKey.value, sortOrder.value);
	});

	const sortRows = (array: Row[], key: string, order: 'asc' | 'desc') => {
		const collator = new Intl.Collator('en', { sensitivity: 'base' });

		return array.sort((a, b) => {
			const aValue = a[key as keyof typeof a];
			const bValue = b[key as keyof typeof b];

			const aStr = (aValue || '').toString().toLowerCase();
			const bStr = (bValue || '').toString().toLowerCase();

			if (aStr === '' && bStr !== '') {
				return 1;
			}
			if (bStr === '' && aStr !== '') {
				return -1;
			}

			if (aStr === 'n/a' && bStr !== 'n/a') {
				return 1;
			}
			if (bStr === 'n/a' && aStr !== 'n/a') {
				return -1;
			}

			return order === 'asc'
				? collator.compare(aStr, bStr)
				: collator.compare(bStr, aStr);
		});
	};

	const updateDisplayedData = () => {
		displayedData.value = sortedData.value.slice(0, loadedCount.value);
	};

	const handleSort = async (key: string, order: 'asc' | 'desc') => {
		sortKey.value = key;
		sortOrder.value = order;
	};

	const handleScroll = () => {
		if (!tableContainer.value || isLoading.value) return;

		const { scrollTop, scrollHeight, clientHeight } = tableContainer.value;
		const isBottom = scrollTop + clientHeight >= scrollHeight - 50;

		if (isBottom && loadedCount.value < props.rowsData.length) {
			isLoading.value = true;
			loadedCount.value += itemsPerPage;
			isLoading.value = false;
		}
	};

	watch([sortedData, loadedCount], updateDisplayedData, { immediate: true });
</script>
