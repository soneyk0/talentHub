<template>
	<div style="position: relative; display: flex; align-items: flex-start">
		<div
			class="flex-1 space-y-4 pr-14"
			style="flex: 1 1 0%; padding-right: 56px"
		>
			<div :style="{ color: 'var(--color-white, #000000)' }">
				<div style="margin: 8px 0; font-weight: 700">Education</div>
				<div>{{ cv.education }}</div>
			</div>
			<div :style="{ color: 'var(--color-white, #000000)' }">
				<div style="margin: 8px 0; font-weight: 700">Language proficiency</div>
				<div v-for="(lang, key) in user.language" :key="key">
					{{ lang.name }} - {{ lang.proficiency }}
				</div>
			</div>
			<div :style="{ color: 'var(--color-white, #000000)' }">
				<div style="margin: 8px 0; font-weight: 700">Domains</div>
				<div v-for="(item, key) in projects" :key="key">
					{{ item.domain }}
				</div>
			</div>
		</div>

		<div
			:style="{
				position: 'absolute',
				left: '50%',
				height: '100%',
				borderLeft: '1px solid var(--color-red-1, #c62f31)',
				transform: 'translateX(-50%)',
			}"
		></div>

		<div style="flex: 1 1 0%">
			<div :style="{ color: 'var(--color-white, #000000)' }">
				<div style="margin: 8px 0; font-weight: 700">
					{{ cv.name }}
				</div>
				<div>{{ cv.description }}</div>
			</div>
			<div
				v-for="(skills, categoryName) in groupedSkills"
				:key="categoryName"
				:style="{ color: 'var(--color-white, #000000)' }"
			>
				<div style="margin: 16px 0 8px 0; font-weight: 700">
					{{ categoryName }}
				</div>
				<span v-for="(skill, index) in skills" :key="index">
					{{ `${skill.name} ` }}
				</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import type { Cv, Project, User } from '~/global';

	const props = defineProps({
		cv: {
			type: Array as PropType<Cv[]>,
			required: true,
		},
		user: {
			type: Array as PropType<User[]>,
			required: true,
		},
		projects: {
			type: Array as PropType<Project[]>,
			required: true,
		},
		groupedSkills: {
			type: Object,
			required: true,
		},
	});
</script>
