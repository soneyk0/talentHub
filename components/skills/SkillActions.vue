<template>
	<div class="sticky bottom-0 bg-dark-1 py-2">
		<div class="flex justify-end gap-4 px-2">
			<template v-if="!isRemovalMode">
				<BaseButton
					class="max-w-[220px]"
					variant="text"
					color="secondary"
					@click="$emit('addSkill')"
				>
					<div class="flex items-center justify-center gap-3">
						<PlusIcon color="var(--color-gray-7)" width="24" />
						{{ $t('ADD SKILL') }}
					</div>
				</BaseButton>
				<BaseButton
					v-if="skills.length > 0"
					class="max-w-[220px]"
					variant="text"
					color="primary"
					@click="$emit('toggleRemovalMode')"
				>
					<div class="flex items-center justify-center gap-3">
						<TrashBin color="var(--color-red-1)" width="24" />
						{{ $t('REMOVE SKILLS') }}
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
					:disabled="selectedSkillsToRemove.size === 0 || isDeletingSkills"
					@click="$emit('deleteSkills')"
				>
					<div class="flex items-center justify-center gap-3">
						{{ $t('Delete') }}
						<div class="w-2">{{ selectedSkillsToRemove.size }}</div>
					</div>
				</BaseButton>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import PlusIcon from '~/components/icons/PlusIcon.vue';
	import TrashBin from '~/components/icons/TrashBin.vue';
	import type { Skill } from '~/global';

	defineProps({
		skills: {
			type: Array as PropType<Skill[]>,
			required: true,
		},
		isRemovalMode: {
			type: Boolean,
			default: false,
		},
		selectedSkillsToRemove: {
			type: Object as PropType<Set<string>>,
			required: true,
		},
		isDeletingSkills: {
			type: Boolean,
			default: false,
		},
	});

	defineEmits([
		'addSkill',
		'toggleRemovalMode',
		'cancelRemoval',
		'deleteSkills',
	]);
</script>
