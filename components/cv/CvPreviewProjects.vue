<template>
	<div>
		<div
			:style="{
				fontSize: '36px',
				lineHeight: '40px',
				color: 'var(--color-white, #000000)',
				marginTop: '24px',
				marginBottom: '16px',
				breakBefore: 'page',
			}"
		>
			Projects
		</div>
		<section
			v-for="(project, key) in projects"
			:key="key"
			style="
				position: relative;
				display: flex;
				align-items: flex-start;
				padding-top: 20px;
			"
		>
			<div style="flex: 1 1 0%; padding-right: 56px; margin-bottom: 24px">
				<div
					:style="{
						fontWeight: 700,
						color: 'var(--color-red-1,#c62f31)',
						margin: '16px 0px 8px 0px',
					}"
				>
					{{ project.name.toUpperCase() }}
				</div>
				<div
					:style="{
						color: 'var(--color-white, #000000)',
						marginTop: '8px',
					}"
				>
					{{ project.description }}
				</div>
			</div>

			<div
				:style="{
					position: 'absolute',
					left: '50%',
					height: '92%',
					marginTop: '10px',
					marginBottom: '10px',
					borderLeft: '1px solid var(--color-red-1, #c62f31)',
					transform: 'translateX(-50%)',
				}"
			></div>

			<div style="flex: 1 1 0%">
				<div :style="{ color: 'var(--color-white, #000000)' }">
					<div style="margin: 16px 0 8px 0; font-weight: 700">
						Project roles
					</div>
					<div>{{ user.position }}</div>
				</div>
				<div :style="{ color: 'var(--color-white, #000000)' }">
					<div style="margin: 16px 0 8px 0; font-weight: 700">Period</div>
					<div>
						{{ formatDate(project.start_date) }} -
						{{ formatDate(project.end_date) }}
					</div>
				</div>
				<div
					v-if="project.responsibilities.length > 0"
					:style="{ color: 'var(--color-white, #000000)' }"
				>
					<div style="margin: 16px 0 8px 0; font-weight: 700">
						Responsibilities
					</div>
					<span v-for="(resp, index) in project.responsibilities" :key="index">
						{{ `${resp}  ` }}
					</span>
				</div>
				<div :style="{ color: 'var(--color-white, #000000)' }">
					<div style="margin: 16px 0 8px 0; font-weight: 700">Environment</div>
					<span v-for="(env, index) in project.environment" :key="index">
						{{ `${env} ` }}
					</span>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import type { Project, User } from '~/global';

	const props = defineProps({
		user: {
			type: Array as PropType<User[]>,
			required: true,
		},
		projects: {
			type: Array as PropType<Project[]>,
			required: true,
		},
	});

	const formatDate = (dateStr: string): string => {
		const [year, month] = dateStr.split('-');
		return `${month}.${year}`;
	};
</script>
