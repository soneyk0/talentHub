<template>
	<div
		:style="{
			fontSize: '36px',
			lineHeight: '40px',
			color: 'var(--color-white, #000000)',
			marginTop: '24px',
			marginBottom: '32px',
			breakBefore: 'page',
		}"
	>
		Professional skills
	</div>
	<table style="font-size: 14px; line-height: 20px">
		<thead>
			<tr
				:style="{
					padding: '16px 8px',
					color: 'var(--color-white, #000000)',
					clipPath: 'inset(0px 1px -1px 1px)',
					boxShadow: '0px 1px 0px  var(--color-red-1, #c62f31)',
				}"
			>
				<th colspan="2" style="padding-left: 16px; text-align: left">SKILLS</th>
				<th style="padding: 16px 8px">EXPERIENCE IN YEARS</th>
				<th style="padding: 16px 8px">LAST USED</th>
			</tr>
		</thead>
		<tbody>
			<template
				v-for="(skills, categoryName) in groupedSkills"
				:key="categoryName"
			>
				<tr
					:style="{
						color: 'var(--color-white, #000000)',
						clipPath: 'inset(0px 1px -1px 1px)',
						boxShadow: '0px 1px 0px  var(--color-gray-3, #8a8a8a)',
					}"
				>
					<td
						:style="{
							padding: '16px 8px',
							textAlign: 'left',
							verticalAlign: 'top',
							fontWeight: 700,
							color: 'var(--color-red-1, #c62f31)',
						}"
					>
						{{ categoryName }}
					</td>
					<td style="text-align: left">
						<span
							v-for="(skill, index) in skills"
							:key="index"
							:style="{
								display: 'block',
								padding: '8px 16px',
								paddingBottom: index === skills.length - 1 ? '24px' : '',
							}"
						>
							{{ skill.name }}
						</span>
					</td>
					<td style="text-align: center">
						<span
							v-for="(skill, index) in skills"
							:key="index"
							:style="{
								display: 'block',
								padding: '8px 16px',
								paddingBottom: index === skills.length - 1 ? '24px' : '',
							}"
						>
							{{ skillsExperience[skill.name]?.years || 0 }}
						</span>
					</td>
					<td style="text-align: center">
						<span
							v-for="(skill, index) in skills"
							:key="index"
							:style="{
								display: 'block',
								padding: '8px 16px',
								paddingBottom: index === skills.length - 1 ? '24px' : '',
							}"
						>
							{{ skillsExperience[skill.name]?.lastUsed || 'N/A' }}
						</span>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<script setup lang="ts">
	import type { Project, Skill } from '~/global';

	const props = defineProps({
		groupedSkills: {
			type: Object,
			required: true,
		},
		skills: {
			type: Array as PropType<Skill[]>,
			required: true,
		},
		projects: {
			type: Array as PropType<Project[]>,
			required: true,
		},
	});

	const skillsExperience = computed(() => {
		const experienceMap: Record<string, { years: number; lastUsed: string }> =
			{};

		props.skills.forEach((skill) => {
			const projectsWithSkill = props.projects.filter((project) =>
				project.environment.includes(skill.name)
			);

			if (!projectsWithSkill.length) {
				experienceMap[skill.name] = { years: 0, lastUsed: 'N/A' };
				return;
			}

			const years = projectsWithSkill.flatMap(({ start_date, end_date }) => [
				parseInt(start_date.split('-')[0]),
				parseInt(end_date.split('-')[0]),
			]);

			const minYear = Math.min(...years);
			const maxYear = Math.max(...years);

			experienceMap[skill.name] = {
				years: maxYear - minYear + 1,
				lastUsed: maxYear.toString(),
			};
		});

		return experienceMap;
	});
</script>
