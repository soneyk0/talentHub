<template>
	<div class="mx-auto max-w-4xl">
		<!-- Первый секшен -->
		<section class="mb-8 flex items-center justify-between">
			<div class="text-4xl text-white">
				<p>{{ user.fullName }}</p>
				<p class="text-lg">{{ user.position.toUpperCase() }}</p>
			</div>
			<div class="flex items-center justify-center gap-3">
				<BaseButton color="primary" type="button" variant="outlined">
					EXPORT PDF
				</BaseButton>
			</div>
		</section>

		<section class="flex flex-col space-y-8">
			<div class="relative flex items-start space-x-8">
				<div class="flex-1 space-y-4 pr-14">
					<div class="text-white">
						<p class="mb-2 font-bold">Education</p>
						<p>{{ cv.education }}</p>
					</div>
					<div class="text-white">
						<p class="mb-2 font-bold">Language proficiency</p>
						<p v-for="(lang, key) in user.language" :key="key">
							{{ lang.name }} - {{ lang.proficiency }}
						</p>
					</div>
					<div class="text-white">
						<p class="mb-2 font-bold">Domains</p>
						<p v-for="(item, key) in cv.projects" :key="key">
							{{ item.domain }}
						</p>
					</div>
				</div>

				<div
					class="absolute left-1/2 h-full w-px -translate-x-1/2 transform bg-red-1"
				></div>

				<div class="flex-1 space-y-4">
					<div class="text-white">
						<p class="mb-2 font-bold">{{ cv.name }}</p>
						<p>{{ cv.description }}</p>
					</div>
					<div
						v-for="(skills, categoryName) in groupedSkills"
						:key="categoryName"
						class="text-white"
					>
						<p class="mb-2 font-bold">{{ categoryName }}</p>
						<span v-for="(skill, index) in skills" :key="index">
							{{ `${skill.name} ` }}
						</span>
					</div>
				</div>
			</div>

			<!--			project-->
			<p class="text-4xl text-white">Projects</p>
			<section
				v-for="(project, key) in cv.projects"
				:key="key"
				class="relative flex items-start space-x-8"
			>
				<div class="flex-1 space-y-4 pr-14">
					<p class="font-bold text-red-1">{{ project.name.toUpperCase() }}</p>
					<p class="text-white">{{ project.description }}</p>
				</div>

				<div
					class="absolute left-1/2 h-full w-px -translate-x-1/2 transform bg-red-1"
				></div>

				<div class="flex-1 space-y-4">
					<div class="text-white">
						<p class="mb-2 font-bold">Project roles</p>
						<p>{{ user.position }}</p>
					</div>
					<div class="text-white">
						<p class="mb-2 font-bold">Period</p>
						<p>{{ project.start_date }} - {{ project.end_date }}</p>
					</div>
					<div v-if="project.responsibilities.length > 0" class="text-white">
						<p class="mb-2 font-bold">Responsibilities</p>
						<span
							v-for="(resp, index) in project.responsibilities"
							:key="index"
						>
							{{ `${resp}  ` }}
						</span>
					</div>
					<div class="text-white">
						<p class="mb-2 font-bold">Environment</p>
						<span v-for="(env, index) in project.environment" :key="index">
							{{ `${env} ` }}
						</span>
					</div>
				</div>
			</section>

			<!--			skills-->
			<p>Professional skills</p>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { getCvById } from '~/services/cv';
	import { getAllSkills, getUserById } from '~/services/user';

	definePageMeta({
		layout: 'cv',
	});

	interface Skill {
		name: string;
		mastery: string;
		categoryId: string;
	}

	const user = reactive({
		fullName: '',
		position: '',
		language: [{ name: '', proficiency: '' }],
	});

	const cv = reactive({
		name: '',
		description: '',
		education: '',
		projects: [
			{
				name: '',
				description: '',
				end_date: '',
				start_date: '',
				environment: [],
				responsibilities: [],
				domain: '',
			},
		],
		skills: [] as Skill[],
	});

	// fetching cv data

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

				cv.skills = newCv.skills.map((skill: Skill) => ({
					name: skill.name,
					mastery: skill.mastery,
					categoryId: skill.categoryId,
				}));
				cv.projects = newCv.projects.map(
					(project: {
						name: string;
						description: string;
						end_date: string;
						start_date: string;
						environment: string[];
						responsibilities: string[];
						domain: string;
					}) => ({
						name: project.name,
						description: project.description,
						end_date: project.end_date,
						start_date: project.start_date,
						environment: project.environment,
						responsibilities: project.responsibilities,
						domain: project.domain,
					})
				);
			}
		},
		{ immediate: true }
	);


	// fetching user data

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
				user.language = newUser.profile.languages.map(
					(lang: { name: string; proficiency: string }) => ({
						name: lang.name,
						proficiency: lang.proficiency,
					})
				);
			}
		},
		{ immediate: true }
	);

	// fetching skill category data

	interface CategoryOfSkills {
		id: string;
		category_name: string;
	}

	const allSkills = reactive<CategoryOfSkills[]>([]);

	const allSkillsDataKey = 'all-skills';
	const { data: allSkillsData } = useNuxtData(allSkillsDataKey);

	if (!allSkillsData.value) {
		const { data } = await useAsyncData(allSkillsDataKey, () => getAllSkills());
		allSkillsData.value = data.value;
	}

	watch(
		() => allSkillsData.value?.skills,
		(newSkills) => {
			if (newSkills) {
				allSkills.splice(0, allSkills.length, ...newSkills);
			}
		},
		{ immediate: true }
	);

	const groupedSkills = computed(() => {
		const categoriesMap = allSkills.reduce(
			(acc, category) => {
				acc[category.id] = category.category_name;
				return acc;
			},
			{} as Record<string, string>
		);

		return cv.skills.reduce(
			(acc, skill) => {
				const categoryName = categoriesMap[skill.categoryId] || 'Other';
				if (!acc[categoryName]) {
					acc[categoryName] = [];
				}
				acc[categoryName].push(skill);
				return acc;
			},
			{} as Record<string, { name: string; mastery: string }[]>
		);
	});
</script>
