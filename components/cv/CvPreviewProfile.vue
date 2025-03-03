<template>
	<div>
		<section
			style="
				margin-bottom: 32px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			"
		>
			<div
				:style="{
					fontSize: '36px',
					lineHeight: '40px',
					color: 'var(--color-white, #000000)',
				}"
			>
				<div>{{ user.fullName }}</div>
				<div style="font-size: 18px; line-height: 28px">
					{{ user.position.toUpperCase() }}
				</div>
			</div>
			<div
				style="
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 12px;
				"
			>
				<BaseButton
					color="primary"
					type="button"
					variant="outlined"
					:disabled="isSubmitting"
					@click="handleExport"
				>
					EXPORT PDF
				</BaseButton>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import type { User } from '~/global';
	import { exportCvToPdf } from '~/services/cv';

	const props = defineProps({
		user: {
			type: Array as PropType<User[]>,
			required: true,
		},
	});

	const isSubmitting = ref(false);

	const handleExport = async () => {
		try {
			isSubmitting.value = true;
			const documentBody = document.getElementById('cv-content')!;
			const clone = documentBody.cloneNode(true) as HTMLElement;
			clone.querySelector('button').remove();
			const htmlContent = clone.innerHTML || '';
			await exportCvToPdf(htmlContent);
		} finally {
			isSubmitting.value = false;
		}
	};
</script>
