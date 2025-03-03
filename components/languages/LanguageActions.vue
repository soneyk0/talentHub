<template>
	<div class="sticky bottom-0 bg-dark-1 py-2">
		<div class="flex justify-end gap-4 px-2">
			<template v-if="!isRemovalMode">
				<BaseButton
					class="max-w-[220px]"
					variant="text"
					color="secondary"
					@click="$emit('addLanguage')"
				>
					<div class="flex items-center justify-center gap-3">
						<PlusIcon color="var(--color-gray-7)" width="24" />
						{{ $t('ADD LANGUAGE') }}
					</div>
				</BaseButton>
				<BaseButton
					v-if="languages.length > 0"
					class="max-w-[220px]"
					variant="text"
					color="primary"
					@click="$emit('toggleRemovalMode')"
				>
					<div class="flex items-center justify-center gap-3">
						<TrashBin color="var(--color-red-1)" width="24" />
						{{ $t('REMOVE LANGUAGES') }}
					</div>
				</BaseButton>
			</template>
			<template v-else>
				<BaseButton
					class="max-w-[220px]"
					variant="outlined"
					color="secondary"
					@click="$emit('cancelRemoval')"
				>
					{{ $t('Cancel') }}
				</BaseButton>
				<BaseButton
					class="max-w-[220px]"
					variant="contained"
					color="primary"
					:disabled="
						selectedLanguagesToRemove.size === 0 || isDeletingLanguages
					"
					@click="$emit('deleteLanguages')"
				>
					<div class="flex items-center justify-center gap-3">
						{{ $t('Delete') }}
						<div class="w-2">{{ selectedLanguagesToRemove.size }}</div>
					</div>
				</BaseButton>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import TrashBin from '~/components/icons/TrashBin.vue';
	import type { Language } from '~/global';

	defineProps({
		languages: {
			type: Array as PropType<Language[]>,
			required: true,
		},
		isRemovalMode: {
			type: Boolean,
			default: false,
		},
		selectedLanguagesToRemove: {
			type: Object as PropType<Set<string>>,
			required: true,
		},
		isDeletingLanguages: {
			type: Boolean,
			default: false,
		},
	});

	defineEmits([
		'addLanguage',
		'toggleRemovalMode',
		'cancelRemoval',
		'deleteLanguages',
	]);
</script>
