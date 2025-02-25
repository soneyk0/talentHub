<template>
	<div
		id="cv-content"
		style="
			margin: 0 auto 32px auto;
			max-width: 100%;
			overflow-y: auto;
			max-height: 80vh;
			padding-left: 12vw;
			padding-right: 12vw;
		"
	>
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

		<section style="display: flex; flex-direction: column">
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
						<div style="margin: 8px 0; font-weight: 700">
							Language proficiency
						</div>
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

			<!--			project-->
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
						<span
							v-for="(resp, index) in project.responsibilities"
							:key="index"
						>
							{{ `${resp}  ` }}
						</span>
					</div>
					<div :style="{ color: 'var(--color-white, #000000)' }">
						<div style="margin: 16px 0 8px 0; font-weight: 700">
							Environment
						</div>
						<span v-for="(env, index) in project.environment" :key="index">
							{{ `${env} ` }}
						</span>
					</div>
				</div>
			</section>

			<!--			skills table-->
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
						<th colspan="2" style="padding-left: 16px; text-align: left">
							SKILLS
						</th>
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
		</section>
	</div>
</template>

<script setup lang="ts">
	import type { Language, Project, Skill } from '~/global';
	import { exportCvToPdf, getCvById } from '~/services/cv';
	import { getSkillCategories, getUserById } from '~/services/user';

	definePageMeta({
		layout: 'cv',
	});

	// fetching cv data

	const cv = reactive({
		name: '',
		description: '',
		education: '',
	});

	const projects = ref<Project[]>([]);
	const skills = ref<Skill[]>([]);

	const route = useRoute();
	const cvId = ref(route.params.id as string);

	const cvDataKey = `user-${cvId.value}`;
	const refreshCv = ref();

	const { data: cvData } = useNuxtData(cvDataKey);

	if (!cvData.value) {
		const { data, refresh } = await useAsyncData(
			cvDataKey,
			() => getCvById(cvId.value),
			{
				server: true,
				lazy: false,
				immediate: true,
			}
		);
		cvData.value = data.value;
		refreshCv.value = refresh;
	}

	watch(
		() => cvData.value?.cv,
		(newCv) => {
			if (newCv) {
				cv.name = newCv.name;
				cv.description = newCv.description;
				cv.education = newCv.education;

				skills.value = newCv.skills;
				projects.value = newCv.projects;
			}
		},
		{ immediate: true, deep: true }
	);

	// fetching user data

	const user = reactive({
		fullName: '',
		position: '',
		language: [{ name: '', proficiency: '' }],
	});

	const { getCurrentUserId } = useCurrentUser();
	const userId = getCurrentUserId;

	const userDataKey = `user-${userId.value}`;
	const refreshUser = ref();

	const { data: userData } = useNuxtData(userDataKey);

	if (!userData.value) {
		const { data, refresh } = await useAsyncData(
			userDataKey,
			() => getUserById(userId.value as string, true),
			{
				server: true,
				lazy: false,
				immediate: true,
			}
		);
		userData.value = data.value;
		refreshUser.value = refresh;
	}

	watch(
		() => userData.value?.user,
		(newUser) => {
			if (newUser) {
				user.fullName = newUser.profile.full_name || '';
				user.position = newUser.position.name;
				user.language = newUser.profile.languages.map((lang: Language) => ({
					name: lang.name,
					proficiency: lang.proficiency,
				}));
			}
		},
		{ immediate: true }
	);

	// fetching skill category data

	interface CategoryOfSkills {
		id: string;
		name: string;
	}

	const categories = ref<CategoryOfSkills[]>([]);
	const categoriesDataKey = 'skill-categories';
	const { data: categoriesData } = useNuxtData(categoriesDataKey);

	if (!categoriesData.value) {
		const { data } = await useAsyncData(categoriesDataKey, () =>
			getSkillCategories()
		);
		categoriesData.value = data.value;
	}

	watch(
		() => categoriesData.value?.categories,
		(newCategories) => {
			if (newCategories) {
				categories.value = newCategories;
			}
		},
		{ immediate: true }
	);

	const groupedSkills = computed(() => {
		if (!categories.value.length || !skills.value.length) return {};

		return categories.value.reduce(
			(acc, category) => {
				const skillsInCategory = skills.value.filter(
					(skill) => skill.categoryId === category.id
				);
				if (skillsInCategory.length) {
					acc[category.name] = skillsInCategory;
				}
				return acc;
			},
			{} as Record<string, Skill[]>
		);
	});

	// helpers

	const formatDate = (dateStr: string): string => {
		const [year, month] = dateStr.split('-');
		return `${month}.${year}`;
	};

	const skillsExperience = computed(() => {
		const experienceMap: Record<string, { years: number; lastUsed: string }> =
			{};

		skills.value.forEach((skill) => {
			const projectsWithSkill = projects.value.filter((project) =>
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
