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
		<CvPreviewProfile :user="user" />
		<section style="display: flex; flex-direction: column">
			<CvPreviewDescription
				:grouped-skills="groupedSkills"
				:projects="projects"
				:user="user"
				:cv="cv"
			/>
			<CvPreviewProjects :projects="projects" :user="user" />
			<CvPreviewSkills
				:grouped-skills="groupedSkills"
				:skills="skills"
				:projects="projects"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
	import CvPreviewDescription from '~/components/cv/CvPreviewDescription.vue';
	import CvPreviewProfile from '~/components/cv/CvPreviewProfile.vue';
	import CvPreviewProjects from '~/components/cv/CvPreviewProjects.vue';
	import CvPreviewSkills from '~/components/cv/CvPreviewSkills.vue';
	import type { Language, Project, Skill } from '~/global';
	import { getCvById } from '~/services/cv';
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

	if (!cvData.value || cvData.value) {
		const { data, refresh } = await useAsyncData(
			cvDataKey,
			() => getCvById(cvId.value),
			{
				server: true,
				lazy: true,
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

	if (!userData.value || userData.value) {
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
				user.position = newUser.position?.name || '';
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

	if (!categoriesData.value || categoriesData.value) {
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
</script>
